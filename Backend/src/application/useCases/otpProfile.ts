
import { MongoUserRepsitories,MongoOtpRepository } from "../../Infrastructure/repositories/mongoRepositories"
import { AuthService } from "../user/auth/authService"

const userRepo=new MongoUserRepsitories()
const otpRepo=new MongoOtpRepository()
const authService=new AuthService(userRepo,otpRepo)

export async function otpProfile(id:unknown){
    try {
        if(typeof id!=='string'){
            throw new Error('error on id')
        }
        const getEmail:any=await userRepo.findEmailByID(id)
        if(!getEmail){
            throw new Error('email not found')
        }  
        console.log(getEmail)
        const sentEmail=await  authService.otpVerificationForForgot(getEmail?.email)
        Promise.all([getEmail,sentEmail]).then((result)=>{
            return true
        }).catch((error:any)=>{
            throw new Error(error.message)
        })  
    } catch (error:any) {
        throw new Error(error.message)
        
    }
    

}