import { UserModel } from "../../Infrastructure/db/userModel"
import {UserRepsitories as  MongoUserRepsitories, } from "../../Infrastructure/repositories/userRepository"
import { ReportUser } from "../../Infrastructure/repositories/reportUser"
import { EmailService } from "../emailService"
export async function reportRejection(reporter:string,reported:string,docId:string){
    const userRepo=new MongoUserRepsitories()
    const emailService=new EmailService()
    const reportUser=new ReportUser()
    try {
    
        const reporterEmail:any=await userRepo.findEmailByID(reporter)
    
     const matterToReporter=`Dear user,
      Sorry to hear that you got bad experience from another user,after thorough checking that,
      the specifed user not violated any guidelines,please connect us,strill you feeling any disconfort`
   
     const sendEmailToReporter=await emailService.sendEmail(reporterEmail.email,'Problem Resolve-mangalya',matterToReporter)
    const response=await reportUser.update(docId,'rejected',true)
    const response2=await reportUser.update(docId,'block',true)
    const response3=await reportUser.update(docId,'warningMail',true)
    console.log(response)  
    return response 
 } catch (error:any) {
     throw new Error(error.message)
    }

}