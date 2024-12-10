import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories"
import { MongoOtpRepository } from "../../Infrastructure/repositories/mongoRepositories"
const userRepo=new MongoUserRepsitories()
const otpRepo=new MongoOtpRepository()
export  async function Validate(id:unknown,otp:unknown){
    console.log(typeof id,typeof otp)
    if(typeof id!=='string'||typeof otp!=='string'){
    throw new Error('error on validation')
    }
    try {
        const email:any=await userRepo.findEmailByID(id)
        if(email){
            const isValid=otpRepo.otpValidation(otp,email.email)
            return isValid
        }else{
            throw new Error('otp not found')
        }
        
    } catch (error) {
        console.log(error)
    }
   
}