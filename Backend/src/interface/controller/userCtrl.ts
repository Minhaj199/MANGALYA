import { Response,Request, response, json } from "express";
import { AuthService } from "../../application/user/auth/authService"; 
import { MongoUserRepsitories,MongoOtpRepository, } from "../../Infrastructure/repositories/mongoRepositories"; 
import { EmailService } from "../../application/emailService";
import { UserModel } from "../../Infrastructure/db/userModel";
import { Cloudinary } from "../../Infrastructure/cloudinary";
import { getAge } from "../../application/ageCalculator";
import { fetchDateForUserSelection } from "../../application/types/userTypes";
import { getId } from "../../Infrastructure/getIdFromJwt";
import { User, UserWithID } from "../../domain/entity/userEntity";


const emailService=new EmailService()
const userRepository=new MongoUserRepsitories()
const otpRepsitory=new MongoOtpRepository()
const authService=new AuthService(userRepository,otpRepsitory)
const cloudinary= new Cloudinary()

export const signup=async (req:Request,res:Response)=>{
    try {
        const user=await authService.signupFirstBatch(req.body)
        res.status(201).json({message:'sign up completed',user:user?.user,token:user?.token,id:user?.id}) 
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
        const {token,name,photo,partner,gender,id}=response
        res.json({message:'password matched',token,name,photo,partner,gender,id})
    } catch (error:any) {
        res.json({message:error.message})
    }
}
export const fetechProfileData=async(req:Request,res:Response)=>{
    console.log(req.query)
    const Gender=req.query.preferedGender||'female'
    
    try {
       
        const data:fetchDateForUserSelection =await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':Gender},{'partnerData.gender':req.query.gender}]}}, {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
            state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
            dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
            photo:'$PersonalInfo.image',match:'$match'}}])
            type UserWithIDArray=UserWithID[]
        //     const matched:UserWithIDArray=await UserModel.find({_id:req.query.id},{match:1}).populate('match')as unknown as UserWithIDArray
        // let datas=data
        
        // console.log(datas)
        // console.log(datas.length)
        // console.log(data.length)

        const processedData=data.map((el,index)=>{
            
            return ({
                ...el,
                no:index+1,
                age:getAge(el.dateOfBirth)
            }) 
        })
        
        res.json(processedData)
    } catch (error) {
        console.log(error)
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
export const secondBatch=async(req:Request,res:Response):Promise<void>=>{
    const obj:{url:string|boolean,responseFromAddinInterest:string|boolean}={responseFromAddinInterest:false,url:false}
    try {
        if(req.file&&req.file.path){
            
            const image=req.file?.path||''
            
           const url=await cloudinary.upload(image)||''
           
         const urlInserted=await userRepository.addPhoto(url,req.body.email)
         obj.url=urlInserted
        }
        const interest:string[]=JSON.parse(req.body.interest)
        if(interest.length>0){
             const responseFromAddinInterest=await userRepository.addInterest(interest,req.body.email)
              obj.responseFromAddinInterest=responseFromAddinInterest
          }
          
    res.json(obj)
    } catch (error:any) {
         res.json( error)
    }
     
}
export const addMatch=async(req:Request,res:Response):Promise<void>=>{
    console.log(req.body)
        const response=await userRepository.addMatch(req.body.userId,req.body.matchId)
        console.log(response)  
        res.json(response) 
}