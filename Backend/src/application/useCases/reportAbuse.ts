import { Types } from "mongoose"
import { AbuserReport } from "../../domain/entity/abuse"
import { ReportUser } from "../../Infrastructure/repositories/mongoRepositories"



export async function Abuse(userId:unknown,reporedId:string,reason:string,moreInfo:string){
    const reportRepo=new ReportUser()        
  
       try {
           if(typeof userId==='string'&&typeof reporedId==='string'){
               console.log(10)
               const data:AbuserReport={
                   reporter: new Types.ObjectId(userId.slice(1,25)),
                   reported:new Types.ObjectId(reporedId),
                   reason,
                   moreInfo,
                   rejected:false,
                   block:false,
                   read:false,
                   warningMail:false
               }
               const response=await reportRepo.create(data)
               console.log(response)
               return response
           }else{
               
               throw new Error('type miss match on ids')
           }
       } catch (error:any) {
           console.log(error)
           throw new Error(error.messaeg||'error on reporting user')
       }

    
   

}
export async function getAllMessages(){
    const reportRepo=new ReportUser()
    try {
        const response=await reportRepo.getMessages()
        return response
    } catch (error:any) {
        throw new Error(error.message||'error on fetching reports')
    }
}