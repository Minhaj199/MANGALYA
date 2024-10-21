import { Response,Request, response } from "express";
import { AuthService } from "../../application/user/auth/authService"; 
import { MongoUserRepsitories,MongoOtpRepository, } from "../../Infrastructure/repositories/mongoRepositories"; 
import { EmailService } from "../../application/emailService";
import { generateOTP } from "../../Infrastructure/otpGenerator";


const emailService=new EmailService()
const userRepository=new MongoUserRepsitories()
const otpRepsitory=new MongoOtpRepository()
const authService=new AuthService(userRepository,otpRepsitory)

export const signup=async (req:Request,res:Response)=>{
    
    try {
        const user=await authService.signupFirstBatch(req.body)
        res.status(201).json({message:'sign up completed',user}) 
    } catch (error:any) {
        console.log(error)
        if(error){
         if(error.code===11000){
            res.json({message:'Email already exist',status:false})
        }else{
            
        res.json({message:"error"})
     }
 }
    }
}

export const otpCreation=async(req:Request,res:Response)=>{
    const {email,from}=req.body
    
   if(from==='forgot'){
    try {
        const response=await authService.otpVerificationForForgot(email)
        if(response){
            if(response){
                res.status(200).json({message:'Email send successfull'})
             } 
        }
    } catch (error:any) {
        res.status(500).json(error.message)
    }
   }else{

       try {
           
           const response=await authService.otpVerification(email)
           if(response){
               res.status(200).json({message:'Email send successfull'})
            }
        } catch (error:any) {
            res.status(500).json(error.message)
        }
    }
    
}
export const login=async(req:Request,res:Response)=>{
    const {email,password}=req.body
   
    try {
        const response=await authService.login(email,password)
        if(!response?.user){
            throw new Error('user not fount')
        }
        const {user,token}=response
        res.json({message:'password matched',user,token})
    } catch (error:any) {
        res.json({message:error.message})
    }
}
export const forgotCheckValidate=async(req:Request,res:Response):Promise<void>=>{
  
    try {
        if(typeof req.query.email==='string'){

            let decoded = decodeURI(req.query.email);
            
            const email=decoded
           
            const isValid=await authService.ForgetValidateEmail(email)
                      
            if(isValid){
                
           const response=await authService.otpVerificationForForgot(email)
           if(response){

               res.json ({email:isValid.email})
           }
            }else{
                 res.json(false)
            }
        }
    } catch (error) {
        res.json(error) 
    }
}
export const forgotCheckValidateSigunp=async(req:Request,res:Response):Promise<void>=>{
  
    try {
       

          
            
            const {email}=req.body
           
            const isValid=await authService.ForgetValidateEmail(email)
                      
            if(isValid){
                res.json ({email:isValid.email})
            }else{
                 res.json(false)
            }
        
    } catch (error) {
        res.json(error) 
    }
}

export const otpValidation=async(req:Request,res:Response):Promise<void>=>{
    try {
        const {email,otp}=req.body
       
        const isValid=await authService.otpValidation(otp,email)
      
        if(isValid){
            res.json({message:'OTP valid'})
        }else{
            res.json({message:'OTP not valid'})
        }
    } catch (error) {
        res.json(error)
    }
}
export const changePassword=async(req:Request,res:Response):Promise<void>=>{
    try {
        const {password,email}=req.body
      
        const isValid=await authService.passwordChange(email,password)
      
        if(isValid){
            res.json({message:'password changed'})
        }else{
            res.json({message:'error on password'})
        }
    } catch (error) {
        res.json(error)
    }
}