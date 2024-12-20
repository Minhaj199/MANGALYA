import { UserModel } from "../../../Infrastructure/db/userModel"
import { BcryptAdapter } from "../../../Infrastructure/bcryptAdapter" 
import { JWTAdapter } from "../../../Infrastructure/jwt"
import { generateOTP } from "../../../interface/Utility/otpGenerator" 
import { UserRepository } from "../../../domain/interface/userRepository"
import { OTPrespository } from "../../../domain/interface/OtpRepsitory"
import { EmailService } from "../../emailService"
import { UserWithID } from "../../../domain/entity/userEntity"


interface FirstBatch{
      
    'SECOND NAME':string;
      'DATE OF BIRTH':string;
      'STATE THAT YOU LIVE':string;
      'YOUR GENDER':string;
      'GENDER OF PARTNER':string;
      'EMAIL':string;
      'PASSWORD':string,
      'FIRST NAME':string   
    
}
const emailService=new EmailService()
export class AuthService{
    private bcryptAdapter:BcryptAdapter
    private jwtGenerator:JWTAdapter
    private userRepository:UserRepository
    private otpRepsistory:OTPrespository
    constructor(userRepository:UserRepository,otpRepsitory:OTPrespository){
        this.bcryptAdapter=new BcryptAdapter()
        this.jwtGenerator=new JWTAdapter()
        this.userRepository=userRepository
        this.otpRepsistory=otpRepsitory
    }
    async signupFirstBatch(firstBatch:FirstBatch){
        const hashedPassoword=await this.bcryptAdapter.hash(firstBatch.PASSWORD)
        const user={
            PersonalInfo:{
                firstName:firstBatch["FIRST NAME"],
                secondName:firstBatch["SECOND NAME"],
                state:firstBatch["STATE THAT YOU LIVE"],
                gender:firstBatch["YOUR GENDER"],
                dateOfBirth:new Date(firstBatch["DATE OF BIRTH"])
            },
            partnerData:{
                gender:firstBatch["GENDER OF PARTNER"]
            },
            email:firstBatch.EMAIL,
            password:hashedPassoword,
            block:false,
            match:[],
            PlanData:[],
            subscriber:'Not subscribed',
            CreatedAt:new Date()
        }
        try {
            const response:UserWithID =await this.userRepository.create(user)
            
            if(response){
                
                const key=process.env.JWT_SECRET_USER||'123'
                const id=JSON.stringify(response._id)||'123'
                const preferedGender=response.partnerData.gender
                const gender=response.PersonalInfo.gender
                const token=this.jwtGenerator.createToken({id:id,role:'user',preferedGender,gender},key,{expiresIn:'1 hour'})
                return {user,token,id:response._id}
            }   
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async login (email:string,password:string){
        
        try {
            const user=await this.userRepository.findByEmail(email)   
            if(!user){
                throw new Error('user not found')
            }
            if(user){
                const isMatch=await this.bcryptAdapter.compare(password,user.password)
                if(isMatch){
                    const preferedGender=user.partnerData.gender
                     const gender=user.PersonalInfo.gender
                    
                   const jwt_key:string=process.env.JWT_SECRET_USER||''
                   const token=this.jwtGenerator.createToken({id:JSON.stringify(user._id) ,role:'user',preferedGender,gender},jwt_key,{expiresIn:'1 hour'})
                   const photo=user.PersonalInfo.image||''
                   return {token,id:user._id,name:user.PersonalInfo.firstName,partner:user.partnerData.gender,photo:photo,gender:user.PersonalInfo.gender,subscriptionStatus:user.subscriber}
                }else{
                    throw new Error('password not matched')
                    
                    }
                }else{
                   
                    throw new Error('user not found')
                }
        } catch (error:any) {

           throw new Error(error.message)
        }
    }
    async ForgetValidateEmail(email:string){
        const isValid=await UserModel.findOne({email:email})
     
            return isValid
        
        
    }
    async otpVerification(email:string){
        try {
          
            const otp=await generateOTP()
            const isCreated=await this.otpRepsistory.create({otp,email})
            await emailService.sendEmail(email,'Signup MANGALYA OTP',`Welcome to Mangalya. Your Signup OTP for Authentication is <h1>${otp}<h1/>`)

            return  true
            
        } catch (error) {
            throw new Error("error on otp authentication")
        }
        
    }
    async otpVerificationForForgot(email:string){
        try {
           
            const otp=await generateOTP()
            const isCreated=await this.otpRepsistory.create({otp,email})
            const subject='Password Reseting'
            await emailService.sendEmail(email,subject,`Welcome to Mangalya. Your password reset OTP for Authentication is <h1>${otp}<h1/>`)
            return  true
            
        } catch (error) {
            throw new Error("error on otp authentication")
        }
        
    }
    async otpValidation(otp:string,email:string){
        try {

          const response=await this.otpRepsistory.otpValidation(otp,email)
        
          if(response){
            return true
          }else{
            return false
          }
        } catch (error) {
            throw new Error('otp falure')
        }
    }
    async passwordChange(email:string,password:string){
        try {
            const hashed=await this.bcryptAdapter.hash(password)
           
            const response=await UserModel.updateOne({email:email},{password:hashed})
           
            if(response){
                return true
            }else{
                throw new Error('error on password creation')
            }
            
        } catch (error) {
            throw new Error('error on password reseting')
         }
    }
}