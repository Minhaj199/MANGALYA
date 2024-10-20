import { UserModel } from "../../../Infrastructure/db/userModel"
import { BcryptAdapter } from "../../../Infrastructure/bcryptAdapter" 
import { JWTAdapter } from "../../../Infrastructure/jwt"
import { generateOTP } from "../../../Infrastructure/otpGenerator" 
import { UserRepository } from "../../../domain/repository/userRepository"
import { User } from "../../../domain/entity/userEntity" 
import { OTPrespository } from "../../../domain/repository/OtpRepsitory"
import { EmailService } from "../../emailService"

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
        console.log(firstBatch)
        const hashedPassoword=await this.bcryptAdapter.hash(firstBatch.PASSWORD)
        const user={
            PesonalInfo:{
                firstName:firstBatch["FIRST NAME"],
                secondName:firstBatch["SECOND NAME"],
                state:firstBatch["STATE THAT YOU LIVE"],
                gender:firstBatch["YOUR GENDER"],
                dateOfBirth:new Date(firstBatch["DATE OF BIRTH"])
            },
            parnerData:{
                gender:firstBatch["GENDER OF PARTNER"]
            },
            email:firstBatch.EMAIL,
            password:hashedPassoword,
            block:false,
            match:0,
            subscriber:'subscribed',
            expiry:new Date()
        }
        
        return await this.userRepository.create(user)
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
                    const jwt_key:string=process.env.JWT_SECRET_USER||''
                   const token=this.jwtGenerator.createToken({id:JSON.stringify(user._id) ,role:'user'},jwt_key,{expiresIn:'1 hour'})
                    return {user,token}
                }else{
                    throw new Error('password not matched')
                    
                    }
                }else{
                    throw new Error('user not found')
                }
        } catch (error) {
            
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
    async otpValidation(otp:string,email:string){
        try {
          const response=await this.otpRepsistory.otpValidation(otp,email)
          console.log(74,response)
          if(response){
            return true
          }else{
            return false
          }
        } catch (error) {
            throw new Error('otp falure')
        }
    }
}