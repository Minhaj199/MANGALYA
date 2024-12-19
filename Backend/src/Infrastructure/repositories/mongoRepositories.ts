import { UserRepository } from "../../domain/interface/userRepository";
import { UserModel } from "../db/userModel";
import { OtpModel } from "../db/otpModel";
import { User, UserWithID } from "../../domain/entity/userEntity";
import { OtpEntity, OTPWithID } from "../../domain/entity/otpEntity";
import { OTPrespository } from "../../domain/interface/OtpRepsitory";
import { SubscriptionPlanRepo } from "../../domain/interface/PlanRepo";

import { ObjectId } from "mongodb";
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from "../../domain/entity/PlanEntity";
import { planModel } from "../db/planModel";
import { Types } from "mongoose";
import { PlanOrder, planOrderModel } from "../db/planOrder";
import { subscriptionPlanModel } from "../db/planModel";
import { profileTypeFetch, userForLanding } from "../../application/types/userTypes";
import { getAge } from "../../interface/Utility/ageCalculator";
import { GetExpiryPlan } from "../../interface/Utility/getExpiryDateOfPlan";
import { getDateFromAge } from "../../interface/Utility/getDateFromAge";
import { updateData } from "../../application/useCases/updateData";


export class MongoUserRepsitories implements UserRepository {
  async create(user: User): Promise<UserWithID> {
    try {
      const newUser = new UserModel(user);
      const savedUser = await newUser.save();
      return savedUser.toObject() as UserWithID;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async findByEmail(email: string): Promise<UserWithID | null> {
    const user = await UserModel.findOne({ email, block: false }).lean();

    return user as UserWithID | null;
  }
  async addPhoto(photo: string, email: string): Promise<boolean> {
    
    try {
      const result = await UserModel.updateOne(
        { email },
        { $set: { "PersonalInfo.image": photo } }
      );
      
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.log('here at 54')
      return error;
    }
  }
  async addInterest(interst: string[], email: string): Promise<boolean> {
    try {
      const result = await UserModel.updateOne(
        { email },
        { $set: { "PersonalInfo.interest": interst } }
      );
      return true;
    } catch (error: any) {
      return false;
    }
  }
  async addMatch(userId: unknown, matchedId: string): Promise<boolean> {
    if(typeof userId==='string'){

      if (userId && matchedId) {
          const userMatchId = new ObjectId(matchedId);
          const userID = new ObjectId(userId);  
          try {
        const isEbleTo: UserWithID | null = await UserModel.findById({
          _id: userId,
        });
        
        if (isEbleTo) {
        
          if (isEbleTo.subscriber === "subscribed") {
               
            
            if (isEbleTo.CurrentPlan) {
           

              if (isEbleTo.CurrentPlan.Expiry > new Date()) {
            

                if (isEbleTo.CurrentPlan.avialbleConnect === 1) {
                    
                  const result = await UserModel.bulkWrite([
                    {
                      updateOne: {
                        filter: { _id: userId },
                        update: {
                          $addToSet: {
                            match: { _id: userMatchId, typeOfRequest: "send" },
                          },
                        },
                      },
                    },
                    {
                      updateOne: {
                        filter: { _id: userId },
                        update: { $set: { subscriber: "connection finished" } },
                      },
                    },
                    {
                      updateOne: {
                        filter: { _id: userId },
                        update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
                      },
                    },
                    {
                      updateOne: {
                        filter: { _id: matchedId },
                        update: {
                          $addToSet: {
                            match: { _id: userID, typeOfRequest: "recieved" },
                          },
                        },
                      },
                    },
                  ]);
                  if (result) {
                    return true;
                  }
                } else if (isEbleTo.CurrentPlan.avialbleConnect > 1) {
            

                  const result = await UserModel.bulkWrite([
                    {
                      updateOne: {
                        filter: { _id: userId },
                        update: {
                          $addToSet: {
                            match: { _id: userMatchId, typeOfRequest: "send" },
                          },
                        },
                      },
                    },
                    {
                      updateOne: {
                        filter: { _id: userId },
                        update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
                      },
                    },
                    {
                      updateOne: {
                        filter: { _id: matchedId },
                        update: {
                          $addToSet: {
                            match: { _id: userID, typeOfRequest: "recieved" },
                          },
                        },
                      },
                    },
                  ]);
                  if (result) {
                    return true;
                  }else{
                    throw new Error('Error on Request sending')
                  }
                } else {
                    throw new Error('Connection count over')
                }
              } else {
                throw new Error("You plan is Expired");
              }
            } else {
              throw new Error("No active Plan");
            }
          } else if (isEbleTo.subscriber === "connect over") {
            throw new Error("You connection count over!! please buy a plan");
          } else {
              
            throw new Error("You are not subscribed, please buy a plan");

          }
        } else {
           

          throw new Error("user not found");
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    } else {
      return false;
    }
    return false;
  }
  async manageReqRes(
    requesterId: string,
    userId: unknown,
    action: string
  ): Promise<boolean> {
    try {
      if (action === "accept"&&typeof userId==='string') {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);
          // const response = await UserModel.updateOne(
          //   { _id: convertedUserID, "match._id": convertedReqID },
          //   { $set: { "match.$.status": "accepted" } }
          // );
          const response=await UserModel.bulkWrite([
            {
              updateOne:{
                filter:{_id: convertedUserID,"match._id": convertedReqID},
                update:{ $set: { "match.$.status": "accepted" }}

              }
            },
            {
              updateOne:{
                filter:{_id: convertedReqID,"match._id": convertedUserID},
                update:{ $set: { "match.$.status": "accepted" }}

              }
            }
          ])
          return true;
        } catch (error) {
          console.log(error);
          throw new Error("error on manage Request");
        }
      } else if (action === "reject"&&typeof userId==='string') {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);
          
          const response=await UserModel.bulkWrite([
            {
              updateOne:{
                filter:{_id: convertedUserID,"match._id": convertedReqID},
                update:{ $set: { "match.$.status": "rejected" }}

              }
            },
            {
              updateOne:{
                filter:{_id: convertedReqID,"match._id": convertedUserID},
                update:{ $set: { "match.$.status": "rejected" }}

              }
            }
          ])
          return true;
        } catch (error) {
          throw new Error("error on manage Request");
        }
      } else {
        throw new Error("error on manage request");
      }
    } catch (error) {
      throw new Error("error on manage request");
    }
  }
  async getUsers(): Promise<userForLanding[]> {
    try {
      const data = (await UserModel.aggregate([
        {
          $facet: {
            boys: [
              { $match: { "PersonalInfo.gender": "male" } },
              { $sort: { _id: -1 } },
              { $limit:2 },
            ],
            girls: [
              { $match: { "PersonalInfo.gender": "female" } },
              { $sort: { _id: -1 } },
              { $limit: 2 },
            ],
          },
        },
        { $project: { combined: { $concatArrays: ["$boys", "$girls"] } } },
        { $unwind: "$combined" },
        { $replaceRoot: { newRoot: "$combined" } },
        {
          $project: {
            _id: 0,
            name: "$PersonalInfo.firstName",
            secondName: "$PersonalInfo.secondName",
            place: "$PersonalInfo.state",
            age: "$PersonalInfo.dateOfBirth",
            image: "$PersonalInfo.image",
          },
        },
      ])) as { name: string; secondName: string; age: Date; image: string }[];

      if (data.length) {
        const response: { name: string; age: number; image: string }[] = [];
        data.forEach((el) => {
          response.push({
            name: `${el.name} ${el.secondName}`,
            age: getAge(el.age),
            image: el.image || "",
          });
        });
        return response;
      } else {
        throw new Error("user not found");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "error on getting new added data");
    }
  }
  async getSearch(data: string,gender:string, preferedGender:string): Promise<profileTypeFetch | []> {
  
    try {
      const datas:{ minAge:number, maxAge: number, district: string, interest:string[]}=JSON.parse(data)
      if(datas.minAge>datas.maxAge){
        throw new Error('please enter a valid range')
      }
      const dates=getDateFromAge(datas.minAge,datas.maxAge)
      if(datas.district&&datas.interest.length!==0){
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':preferedGender},{'partnerData.gender':gender},{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}},{'PersonalInfo.state':datas.district},{'PersonalInfo.interest':{$all:datas.interest}}]}},
          {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
        ])
        return responseDB
      }
      else if(!datas.district&&datas.interest.length===0){
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':preferedGender},{'partnerData.gender':gender},{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}}]}},
          {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
        
        ])
        // console.log(responseDB)
        return responseDB
      }else if(datas.district){
        
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}},
          {'PersonalInfo.state':datas.district}
        ]}},
        {$project:{name:'$PersonalInfo.firstName',
          lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
              state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
              dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
              photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
      ])
        
        return responseDB
      }else if(datas.interest.length!==0){
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':preferedGender},{'partnerData.gender':gender},{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}},{'PersonalInfo.interest':{$all:datas.interest}}]}},
          {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
        ])
        return responseDB
      }
      throw new Error('Error on search (299-mrpt)')
    } catch (error:any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
  async findEmailByID(id: unknown): Promise<string> {
    try {
      
      if(!id||typeof id!=='string'){
        throw new Error('id not found')
      }
      const changedId=id as string
      const email:any=await UserModel.findById(changedId,{_id:0,email:1})
      if(email){
        return email
      }
      throw new Error('email not found')
    } catch (error:any) {
      throw new Error(error.message||'error on email fetching')
    }
  }
  async getUserProfile(id: string): Promise<UserWithID> {
    try {
      const user:unknown=await UserModel.findOne({_id:id.slice(1,25)}).lean()
      if(user){
        return user as UserWithID 
      }else{
        throw new Error('user not found')
      }
    } catch (error:any) {
      console.log(error)
      throw new Error(error.message||'error on profile fetching')
    }
  }
  async update(user: updateData,id:string): Promise<UserWithID> {
    console.log(id.length+' i am')
    try {
      const response:unknown=await UserModel.findOneAndUpdate({_id:id},{$set:user}, { new: true })   
      console.log(response)
      if(response){
        return response as UserWithID
      }else{
        throw new Error('not updated')
      }  
    } catch (error:any) {
      throw new Error(error.message||'error on update')
    }
  }
  async getRevenue(): Promise<{ month: string[], revenue:number[] }> {
    
    const result=await planOrderModel.aggregate([{$group:{_id:{'$dateToString':{format: "%Y-%m-%d", date: "$created"}},total:{$sum:'$amount'}}},
      {$sort:{_id:-1}},
      {$limit:7}
    ])
    console.log(result)
    const month:string[]=[]
    const total:number[]=[]
    if(result.length){
      result.forEach((el)=>{
          month.push(el?._id.slice(5))
          total.push(el?.total)
      },[])
    }
   
    return { month:month, revenue:total }
  }
  async getSubcriberCount(): Promise<number[]> {
    try {
      const data:any=await UserModel.aggregate([{$group:{_id:'$subscriber',count:{$sum:1}}}])
      let ans={subscriber:0,notSubscriber:0}
      if(data?.length){
        data.forEach((el: { _id: string, count: number })=>{
          if(el._id==='subscribed'||el._id==='connection finished'){
            ans.subscriber+=el.count
          }else{
            ans.notSubscriber+=el.count
          }
        })
      }
      const response=[]
      response[0]=parseFloat (((ans.subscriber/(ans.notSubscriber+ans.subscriber))*100).toFixed(2))
      response[1]= parseFloat(((ans.notSubscriber/(ans.notSubscriber+ans.subscriber))*100).toFixed(2))
    
      return response
    } catch (error:any) {
      throw new Error(error.message)
    }
   
  }
  async getDashCount(): Promise<{ MonthlyRevenue: number; SubscriberCount: number; UserCount: number; }> {
    const data: any = await UserModel.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "totalCount" }], 
          subscriberGroups: [
            {
              $group: {
                _id: "$subscriber", 
                count: { $sum: 1 } 
              }
            }
          ]
        }
      }
    ])
    const revenue:any=await planOrderModel.aggregate([
      {
        $group: {
          _id: null, 
          totalAmount: { $sum: "$amount" } 
        }
      }
    ])
    console.log(revenue)
    let ans={subscriber:0,notSubscriber:0}
    if(data?.length){
      data[0].subscriberGroups.forEach((el: { _id: string, count: number })=>{
        if(el._id==='subscribed'||el._id==='connection finished'){
          ans.subscriber+=el.count
        }else{
          ans.notSubscriber+=el.count
        }
      })
    }
    // [ { _id: null, totalAmount: 26840 } ]
   
    return { MonthlyRevenue:revenue[0].totalAmount, SubscriberCount: ans.subscriber, UserCount:data[0].totalCount[0].totalCount }
  }
}
export class MongoOtpRepository implements OTPrespository {
  async create(otpData: OtpEntity): Promise<OTPWithID> {
    const newOTP = new OtpModel(otpData);
    const savedOTP = await newOTP.save();
    return newOTP as OTPWithID;
  }
  async otpValidation(otp: string, email: string): Promise<boolean> {
    try {
      const otpDoc = await OtpModel.aggregate([
        { $match: { email: email } },
        { $sort: { _id: -1 }},
        { $limit: 1 },
      ]);
      const otpParsed: number = parseInt(otp);
      if (otpDoc) {
        if (otpDoc[0].email === email && otpDoc[0].otp === otpParsed) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("otp failure");
    }
  }
}
export class MongodbPlanRepository implements SubscriptionPlanRepo {
  async create(plan: SubscriptionPlan): Promise<boolean> {
    try {
      const response: SubscriptionPlanDocument | null = (await planModel.create(
        plan
      )) as SubscriptionPlanDocument;

      if (response) {
        return true;
      } else {
        throw new Error("Error on response");
      }
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Name already exist");
      } else {
        throw new Error(error);
      }
    }
  }
  async getAllPlans(): Promise<SubscriptionPlanDocument[] | []> {
    try {
      const response: SubscriptionPlanDocument[] | [] = await planModel.find({
        delete: false,
      });
     
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async editPlan(data: SubscriptionPlanDocument): Promise<true> {
    try {
      if (typeof data._id === "string") {
        const response = await planModel.updateOne(
          { _id: data._id },
          { $set: data }
        );
        if (response) {
          return true;
        }
      }
      throw new Error("Error on id");
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Name already exist");
      } else {
        throw new Error(error);
      }
    }
  }
  async softDlt(id: string): Promise<true> {
    try {
   
      const response = await planModel.updateOne(
        { _id: id },
        { $set: { delete: true } }
      );
      if (response) {
       
        return true;
      }
      throw new Error("Error on remove plan");
    } catch (error: any) {
      throw new Error(error.message || "error on remove plan");
    }
  }
}

export class MongoPurchasedPlan {
  async createOrder(
    userid: unknown,
    planData: subscriptionPlanModel
  ): Promise<true> {
    if(typeof userid==='string'){
      const data: PlanOrder = {
        userID: new ObjectId(userid),
        amount: planData.amount,
        connect: parseInt(planData.connect),
        avialbleConnect: parseInt(planData.connect),
        duration: planData.duration,
        features: planData.features,
        name: planData.name,
        Expiry: GetExpiryPlan(planData.duration),
      };
      try {
        const response = await planOrderModel.create(data);
        const response2 = await UserModel.updateOne(
          { _id: new Types.ObjectId(userid) },
          {$push:{PlanData: response._id} ,$set:{ subscriber: "subscribed", CurrentPlan: data} }
        );
        if (response && response2) {
          return true;
        } else {
          throw new Error("error on plan purchase");
        }
      } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
      }
    }else{
      throw new Error('Error on purchase')
    }
    }
}

