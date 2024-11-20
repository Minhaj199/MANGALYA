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
import { userForLanding } from "../../application/types/userTypes";
import { getAge } from "../../interface/Utility/ageCalculator";
import { GetExpiryPlan } from "../../interface/Utility/getExpiryDateOfPlan";

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
  async addMatch(userId: string, matchedId: string): Promise<boolean> {
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
    } else {
      return false;
    }
    return false;
  }
  async manageReqRes(
    requesterId: string,
    userId: string,
    action: string
  ): Promise<boolean> {
    try {
      if (action === "accept") {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);
          const response = await UserModel.updateOne(
            { _id: convertedUserID, "match._id": convertedReqID },
            { $set: { "match.$.status": "accepted" } }
          );
          return true;
        } catch (error) {
          console.log(error);
          throw new Error("error on manage Request");
        }
      } else if (action === "reject") {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);
          const response = await UserModel.updateOne(
            { _id: convertedUserID, "match._id": convertedReqID },
            { $set: { "match.$.status": "rejected" } }
          );
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
              { $limit: 2 },
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
        { $sort: { _id: -1 } },
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
  
}

