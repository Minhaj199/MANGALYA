import { UserModel } from "../../Infrastructure/db/userModel"
import {UserRepsitories as MongoUserRepsitories, } from "../../Infrastructure/repositories/userRepository"
import { ReportUser } from "../../Infrastructure/repositories/reportUser"
import { EmailService } from "../emailService"
export async function abuserBlocker(reporter:string,reported:string,docId:string){
    const userRepo=new MongoUserRepsitories()
    const emailService=new EmailService()
    const reportUser=new ReportUser()
    try {
    
        const reportedEmail:any=await userRepo.findEmailByID(reported)
        const reporterEmail:any=await userRepo.findEmailByID(reporter)
     const matter=`Dear user,
     this warning male from mangalya matrimonial. You have been reported from abusive acts,your account suspended till further update
     `
     const matterToReporter=`Dear user,
      Sorry to hear that you got bad experience from another user,we took action the abuser took action in your case`
        const sendEmailToAbuser=await emailService.sendEmail(reportedEmail.email,'warning male from mangalya',matter)
     const sendEmailToReporter=await emailService.sendEmail(reporterEmail.email,'Problem Resolve-mangalya',matter)
    const response=await reportUser.update(docId,'block',true)
    await UserModel.findByIdAndUpdate(reported,{$set:{block:true}})
    console.log(response)  
    return response 
 } catch (error:any) {
     throw new Error(error.message)
    }

}