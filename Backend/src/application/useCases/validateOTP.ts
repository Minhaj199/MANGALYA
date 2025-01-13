import {UserRepsitories as MongoUserRepsitories } from "../../Infrastructure/repositories/userRepository"
import {OtpRepository as MongoOtpRepository } from "../../Infrastructure/repositories/userRepository"
const userRepo=new MongoUserRepsitories()
const otpRepo=new MongoOtpRepository()
export  async function Validate(id:unknown,otp:unknown,from:string){
   
    
   
}