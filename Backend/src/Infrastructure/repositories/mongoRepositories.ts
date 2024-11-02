import { UserRepository} from "../../domain/repository/userRepository";
import { UserModel } from "../db/userModel";
import { OtpModel } from "../db/otpModel";
import { User,UserWithID } from "../../domain/entity/userEntity";
import { OtpEntity,OTPWithID } from "../../domain/entity/otpEntity";
import { OTPrespository } from "../../domain/repository/OtpRepsitory";
import { SubscriptionPlanRepo } from "../../domain/repository/PlanRepo";

import { ObjectId } from "mongodb";
import { SubscriptionPlan, SubscriptionPlanDocument } from "../../domain/entity/PlanEntity";
import { planModel } from "../db/planModel";
import { Types } from "mongoose";



export class MongoUserRepsitories implements UserRepository{
   async create(user: User): Promise<UserWithID> {
    try {
        
        const newUser=new UserModel(user)
        const savedUser=await newUser.save()
        return savedUser.toObject() as UserWithID
    } catch (error:any) {
        throw new Error(error.message)
    }
    }
    async findByEmail(email: string): Promise<UserWithID|null> {
        
        const user=await UserModel.findOne({email,block:false}).lean()
        
        return user as UserWithID|null
    }
    async addPhoto(photo: string,email:string): Promise<boolean> {
        try {
            const result=await UserModel.updateOne({email},{$set:{'PersonalInfo.image':photo}})
            if(result){
                return true
            }else{
                return false
            }
            
        } catch (error:any) {
            return error
        }
    }
    async addInterest(interst: string[], email: string): Promise<boolean> {
        try {
            const result=await UserModel.updateOne({email},{$set:{'PersonalInfo.interest':interst}})
            return true
        } catch (error:any) {
            return false
        }
    }
    async addMatch(userId: string, matchedId: string): Promise<boolean> {
        if(userId&&matchedId){
        
            const userMatchId=new ObjectId(matchedId)
            const userID=new ObjectId(userId)
            
            
            
            try {
                const result=await UserModel.bulkWrite([{updateOne:{filter:{_id:userId},update:{$addToSet:{match:{_id:userMatchId,typeOfRequest:'send'}}}}},{updateOne:{filter:{_id:matchedId},update:{$addToSet:{match:{_id:userID,typeOfRequest:'recieved'}}}}}])
                
                if(result){
                    return true
                }
            } catch (error) {
             console.log(error)
             return false   
            }
        }else{
            return false
        }
        return false
    }
    async manageReqRes(requesterId: string,userId:string, action: string): Promise<boolean> {
        try {
           
           
            
            if(action==='accept'){
                try {
                   
                    const convertedReqID=new Types.ObjectId(requesterId)
                    const convertedUserID=new Types.ObjectId(userId)
                    const response=await UserModel.updateOne({_id:convertedUserID,'match._id':convertedReqID},{$set:{'match.$.status':'accepted'}})
                    return true
                } catch (error) {
                   
                    console.log(error)
                    throw new Error('error on manage Request')
                }
            }else if(action==='reject'){
                try {
                   
                    const convertedReqID=new Types.ObjectId(requesterId)
                    const convertedUserID=new Types.ObjectId(userId)
                    const response=await UserModel.updateOne({_id:convertedUserID,'match._id':convertedReqID},{$set:{'match.$.status':'rejected'}})
                    return true
                } catch (error) {
                    throw new Error('error on manage Request')
                }
            }else{

                throw new Error('error on manage request')
            }
        } catch (error) {
           
           throw new Error('error on manage request')
           
        }
        
            
    }
    
}
export class MongoOtpRepository implements OTPrespository{
    async create(otpData:OtpEntity): Promise<OTPWithID> {
    const newOTP=new OtpModel(otpData)
    const savedOTP=await newOTP.save()
    return newOTP as OTPWithID
    }
    async otpValidation(otp: string,email:string): Promise<boolean> {
        try {
           
            const otpDoc=await OtpModel.aggregate([{$match:{email:email}},{$sort:{_id:-1}},{$limit:1}])
            const otpParsed:number=parseInt(otp)
            if(otpDoc){
                if(otpDoc[0].email===email&&otpDoc[0].otp===otpParsed){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }    
        } catch (error) {
            throw new Error('otp failure')
        }
        
    }

}
export class MongodbPlanRepository implements SubscriptionPlanRepo{
   
    async create(plan: SubscriptionPlan): Promise<boolean> {
       try {
           const response:SubscriptionPlanDocument|null=await planModel.create(plan)as SubscriptionPlanDocument
           
           if(response){
               return true
           }else{
            throw new Error('Error on response')
           }
           
       } catch (error:any) {
        if(error.code===11000){

            throw new Error( 'Name already exist')
        }else{
            throw new Error(error)
        }
       }

    }
}