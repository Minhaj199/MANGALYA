import { Response,Request, response } from "express";
import { AuthService } from "../../application/user/auth/authService"; 
import { MongoUserRepsitories,MongoOtpRepository, } from "../../Infrastructure/repositories/mongoRepositories"; 


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
    const {email}=req.body
    try {
        
        const response=await authService.otpVerification(email)
        if(response){
            res.status(200).json({message:'Email send successfull'})
        }
    } catch (error:any) {
        res.status(500).json(error.message)
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
        
        const {email}=req.body
        console.log(email)
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
        console.log(isValid)
        if(isValid){
            res.json({message:'OTP valid'})
        }else{
            res.json({message:'OTP not valid'})
        }
    } catch (error) {
        res.json(error)
    }
}