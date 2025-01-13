import { Types } from "mongoose";
import { AbuserReport } from "../../domain/entity/abuse";
import { ReportUser } from "../../Infrastructure/repositories/reportUser"; 



export class ReportAbuseService{
    private reportRepo:ReportUser

    constructor(reportRepo:ReportUser){
        this.reportRepo=reportRepo
    }

    async checkingDupliacateComplaint(id:string,reason:string,profileId:string){
        const check:AbuserReport|null=await this.reportRepo.findComplain(id,reason,profileId)
        return check
    }
    async createReport(userId:unknown,reporedId:string,reason:string,moreInfo:string){
         try {
             if(typeof userId==='string'&&typeof reporedId==='string'){
                       const isDuplicate= await this.checkingDupliacateComplaint(userId,reason,reporedId)
                       console.log(isDuplicate)
                       if(!isDuplicate){

                           const data:AbuserReport={
                               reporter: new Types.ObjectId(userId),
                               reported:new Types.ObjectId(reporedId),
                               reason,
                               moreInfo,
                               rejected:false,
                               block:false,
                               read:false,
                               warningMail:false
                           }
                           const response=await this.reportRepo.create(data)
                           if(response){
                               return true
                           }else{
                            throw new Error('internal server error')
                           }
                       }else{
                         throw new Error('complaint already taken on specified reason')
                       }
                   }else{
                       
                       throw new Error('type miss match on ids')
                   }
               } catch (error:any) {
                  
                   throw new Error(error.message||'error on reporting user')
               }
    }
}