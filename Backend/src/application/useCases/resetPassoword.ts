import { MongoUserRepsitories,MongoOtpRepository } from "../../Infrastructure/repositories/mongoRepositories"
import { AuthService } from "../user/auth/authService"

const userRepo=new MongoUserRepsitories()
const otpRepo=new MongoOtpRepository()
const authService=new AuthService(userRepo,otpRepo)

export async function changePasswordProfile(password:unknown,id:unknown){
 

    if(typeof password!=='string'||typeof id!=='string'){
        throw new Error('error on password changing')
    }
try {
    const email:any=await userRepo.findEmailByID(id)
    
    if(!email){
        throw new Error('error on password changing')
    }
    const response= await authService.passwordChange(email?.email,password)
    return response
} catch (error:any) {
    throw new Error(error.message)
}

}