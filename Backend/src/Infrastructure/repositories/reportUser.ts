import { Types } from "mongoose"
import { AbuserRepositoryInterface } from "../../domain/interface/abuseRepository"
import { AbuserMongoDoc } from "../../types/TypesAndInterfaces"
import { reportUser } from "../db/reportedUser"
import BaseRepository from "./baseRepository"
import { AbuserReport } from "../../domain/entity/abuse"

export class ReportUser extends BaseRepository<AbuserMongoDoc> implements AbuserRepositoryInterface{
  constructor(){
    super(reportUser)
  }
  async findComplain(id: string,reason:string,partnerId:string): Promise<AbuserMongoDoc|null> {
    try {
      return await this.model.findOne({reporter:new Types.ObjectId(id),reported:new Types.ObjectId(partnerId),reason:reason})  
    } catch (error:any) {
      throw new Error(error.message)
    }
    
  }
  async getMessages(): Promise<AbuserReport[]|[]> {
    try {
      const response=await this.model.find().sort({_id:-1}).populate('reporter','PersonalInfo.firstName').populate('reported','PersonalInfo.firstName')  
      return response
    } catch (error:any) {
   
      throw new Error(error.message||'error on data fetching')
    }
  
  }
  async delete(id: string): Promise<boolean> {
   try {
     const response:{ acknowledged: boolean, deletedCount: number }=await reportUser.deleteOne({_id:new Types.ObjectId(id)})
     console.log(response)
      if(response.acknowledged){
        return true
      }else{
        throw new Error('error on deletion')
      }
   } catch (error:any) {
    throw new Error(error.message)
   }
   
  }
  async update(id:string,field:string,change:string|boolean): Promise<boolean> {
    
    
    try {
      
     const response=await reportUser.updateOne({_id:new Types.ObjectId(id)},{$set:{[field]:change}})
 
     if(response){
       return true
     }else{
    
      throw new Error('error on setWaring')
     }
   } catch (error:any) {
 
    throw new Error(error.message||'error on message')
   }
  }

}