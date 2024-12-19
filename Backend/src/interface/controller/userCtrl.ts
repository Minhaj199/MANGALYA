import { Response,Request, response, json } from "express";
import { AuthService } from "../../application/user/auth/authService"; 
import { MongoUserRepsitories,MongoOtpRepository, MongodbPlanRepository} from "../../Infrastructure/repositories/mongoRepositories"; 
import { EmailService } from "../../application/emailService";
import { UserModel } from "../../Infrastructure/db/userModel";
import { Cloudinary } from "../Utility/cloudinary";
import { getAge } from "../Utility/ageCalculator";
import { Types } from "mongoose";
import { profileTypeFetch } from "../../application/types/userTypes";
import { MongoPurchasedPlan } from "../../Infrastructure/repositories/mongoRepositories";
import { InterestModel } from "../../Infrastructure/db/signupInterest";
import { searchOnProfile } from "../../application/useCases/searchOnProfiles";
import { doStripePayment } from "../../application/paymentSerivice";
import { SubscriptionPlan } from "../../domain/entity/PlanEntity";
import { Token } from "@stripe/stripe-js";
import { getUserProfileUseCase } from "../../application/useCases/getUserProfile";
import { otpProfile } from "../../application/useCases/otpProfile";
import { Validate } from "../../application/useCases/validateOTP";
import { changePasswordProfile } from "../../application/useCases/resetPassoword";
import { upload } from "../Utility/multer";
import { uploadImage } from "../../application/useCases/uploadImage";
import { updateData } from "../../application/useCases/updateData";


const emailService=new EmailService()
const planRepo=new MongodbPlanRepository
const userRepository=new MongoUserRepsitories()
const otpRepsitory=new MongoOtpRepository()
const authService=new AuthService(userRepository,otpRepsitory)
const cloudinary= new Cloudinary()
const orderRepo=new MongoPurchasedPlan()

export const signup=async (req:Request,res:Response)=>{
    try {
        const user=await authService.signupFirstBatch(req.body)
        res.status(201).json({message:'sign up completed',token:user?.token}) 
    } catch (error:any) {
        
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
        const {token,name,photo,partner,gender,id,subscriptionStatus}=response
            
        res.json({message:'password matched',token,name,photo,partner,gender,id,subscriptionStatus})
   
    } catch (error:any) {
      
        
        res.json({message:error.message})
    }
}
export const fetechProfileData=async(req:Request,res:Response)=>{
    
    
    try {
        
        if(req.userID ){
        
            const idd=new Types.ObjectId(req.userID.slice(1,25))
          
          
          

                        let datas:{profile:profileTypeFetch,request:profileTypeFetch}[]=await UserModel.aggregate([{
                $facet:{
                    profile:[{$match:{$and:[{'PersonalInfo.gender':req.preferedGender},{'partnerData.gender':req.gender},{match:{$not:{$elemMatch:{_id:idd}}}}]}},{$project:{name:'$PersonalInfo.firstName',
                    lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                        state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                        dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                        photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}],
                    request:[{$match:{_id:idd}},{$unwind:'$match'},{$match:{'match.status':'pending','match.typeOfRequest':'recieved'}},
                        {$lookup:{from:'users',localField:'match._id',foreignField:'_id',as:'matchedUser'}},{$unwind:'$matchedUser'},{$project:{_id:0,matchedUser:1}},
                    {$project:{_id:'$matchedUser._id',name:'$matchedUser.PersonalInfo.firstName',
                    lookingFor:'$matchedUser.partnerData.gender',secondName:'$matchedUser.PersonalInfo.secondName',
                    state:'$matchedUser.PersonalInfo.state',gender:'$matchedUser.PersonalInfo.gender',
                    dateOfBirth:'$matchedUser.PersonalInfo.dateOfBirth',interest:'$matchedUser.PersonalInfo.interest',
                    photo:'$matchedUser.PersonalInfo.image'}},{$sort:{_id:-1}}]
                }
            }])
            
            let currntPlan=await UserModel.aggregate([{$match:{_id:idd}},{$project:{_id:0,CurrentPlan:1}}])
            
            let interest:unknown[]=await InterestModel.aggregate([
                {
                    $project: {
                      arrayFields: {
                        $filter: {
                          input: { $objectToArray: "$$ROOT" }, 
                          as: "field",
                          cond: { $isArray: "$$field.v" }, 
                        },
                      },
                    },
                  },
                  {
                    $project: {
                      allInterests: {
                        $reduce: {
                          input: "$arrayFields",
                          initialValue: [],
                          in: { $concatArrays: ["$$value", "$$this.v"] }, 
                        },
                      },
                    },
                  },
              ]);
             let interestArray:{allInterests:string[]}[]=[]
            if(interest?.length){
             interestArray= interest as {allInterests:string[]}[]
            }
            if(!interestArray[0].allInterests){
                throw new Error('Error on interest fetching')
            }

            
            if(datas[0].profile){

                 datas[0].profile=datas[0].profile.map((el,index)=>{
                
                    return ({
                        ...el,
                        no:index+1,
                        age:getAge(el.dateOfBirth)
                    }) 
                })
            }
            
            res.json({datas,currntPlan:currntPlan[0]?.CurrentPlan,interest:interestArray[0].allInterests})
        }else{
            throw new Error('id not found')
        }
            
       
        
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
   
    try {
        
        const response=await userRepository.addMatch(req.userID?.slice(1,25),req.body.matchId)
         
        res.json(response) 
    } catch (error) {
        res.json(error)
    }
}
export const  manageReqRes=async(req:Request,res:Response):Promise<void>=>{
   
    try {
        const response=await userRepository.manageReqRes(req.body.id,req.userID?.slice(1,25),req.body.action)
        if(response){

            res.json({message:'changed'})
        }else{
            throw new Error('error on request management')
        }
    } catch (error:any) {
        res.json(error.message)
    }
    
}
export const fetchPlanData=async (req:Request,res:Response):Promise<void>=>{
    try {
        const data=await planRepo.getAllPlans()
        res.json(data)
    } catch (error:any) {
        res.json({message:error.message})
    }

}
export const purchasePlan=async (req:Request,res:Response):Promise<void>=>{
    try {
       
       
        
       
        const result=await doStripePayment(req.body.planData,req.body?.token,req.body?.token.email)

        if(result==='succeeded'){
            const response=await  orderRepo.createOrder(req.userID?.slice(1,25),req.body.planData)
            res.json({status:response})
        }else{
            throw new Error('Error on payment')
        }
    } catch (error:any) {
     
        res.json({message:error.message})
    }
}
export const fetchDataForProfile=async (req:Request,res:Response):Promise<void>=>{
    try {
        const response=await userRepository.getUsers()
        if(response){
            res.json(response)
        }else{
            throw new Error('Error on new user data collection')
        }
    } catch (error:any) {
        res.json({error:error.message})
    }
}
export const fetchInterest=async (req:Request,res:Response):Promise<void>=>{
    try {
       const response=await InterestModel.findOne({},{_id:0,sports:1,music:1,food:1})
       if(response){
        res.json({Data:response})
       }else{
        throw new Error("Error on interst getting")
       } 
    } catch (error:any) {
        res.json({message:error.message||'Error on message interest getting'})
    }
}
// export const subscriptionPayment=async (req:Request,res:Response):Promise<void>=>{
//     console.log('i am at subscription route')
    
//     try {
//         const plan:SubscriptionPlan={
//             amount:'200',
//             connect:'100',
//             duration:6,
//             features:[],
//             name:'sample'
//         }
     
//       console.log(result)
//       res.json({result})
//     } catch (error:any) {
//         res.status(500).json({message:error.message})
//     }
// }

export const getUserProfile=async(req:Request,res:Response)=>{
    
    try {
        const user=await getUserProfileUseCase(req.userID?.slice(1,25))
        res.json({user})
    } catch (error:any) {
        res.json({message:error.message})
    }
}
export const otpForResetPassword=async(req:Request,res:Response)=>{
    
    const sentOpt= await otpProfile(req.userID?.slice(1,25))
}

export const otpForUserResetPassword=async(req:Request,res:Response)=>{
    try {
        
        const validate=await Validate(req.userID?.slice(1,25),JSON.stringify(req.body.OTP))
        res.json({status:validate})
    } catch (error:any) {
        res.json({message:error.message})
    }
    
}
export const resetPassword=async(req:Request,res:Response)=>{
    try {
        const { password ,confirmPassword }=req.body
        if(password===confirmPassword){
            const response=await changePasswordProfile(password,req.userID?.slice(1,25))
           
            res.json({status:response})
        }else{
            throw new Error('Password not match')
        }
        
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
}
export const editProfile=async(req:Request,res:Response)=>{
   
   
    try {
        if(req.file){    
            const response=await uploadImage(req.file,req.userID?.slice(1,25))
            const updateDetail=await updateData(JSON.parse (req.body.data),req.userID)
                res.json({status:true, newData:updateDetail})
        }else{
            const updateDetail=await updateData(JSON.parse (req.body.data),req.userID?.slice(1,25))
            if(typeof updateDetail==='string'){
                res.json({newData:updateDetail})
            }else{
                res.json({newData:updateDetail})
            }
        }
    } catch (error:any) {
        console.log('user controll no data dittected')
        console.log(error)
        res.json({message:error.messaeg||'error on update'})
    }
}

