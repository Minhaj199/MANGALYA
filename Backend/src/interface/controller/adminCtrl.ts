import {  Request,Response } from "express";
import { AdminAuth } from "../../application/admin/auth/authService";
import { UserModel } from "../../Infrastructure/db/userModel";
import { JWTAdapter } from "../../Infrastructure/jwt";
import { jwtInterface } from "../middlewares/jwtAdmin";
import { MongodbPlanRepository } from "../../Infrastructure/repositories/mongoRepositories";
import { SubscriptionPlan } from "../../domain/entity/PlanEntity";

const adminAuthentication=new AdminAuth()
const planRepo=new MongodbPlanRepository()

export const login=(req:Request,res:Response)=>{

    try {
        const {email,password}=req.body
        const isValid=adminAuthentication.login(email,password)
       
        if(isValid?.message==='admin verified'){          
            res.json({adminVerified:true,token:isValid.token})
        }else if(isValid?.message==='password not matching'){
            res.json({password:isValid.message})
        }else if(isValid?.message==='user name not found'){
            res.json({username:'user name not found'})    
            }
    } catch (error:any) {
      
       if(error.message==='user name not found'){
           res.json({username:error.message})
       }
    if(error.message==="password not matching"){
            res.json({password:error.message})
        }
    }
}
export const fetechData=async(req:Request,res:Response)=>{
    try {
       
        const data =await UserModel.aggregate([{$sort:{_id:-1}},{$project:{username:'$PersonalInfo.firstName',email:1,match:1,subscriber:1,expiry:1,block:1}}])
        const processedData=data.map((el,index)=>({
            ...el,
            expiry:el.expiry.toDateString(),
            
            no:index+1
        }))
       console.log(processedData)
        res.json(processedData)
    } catch (error) {
        console.log(error)
    }
}

export const userBlockAndUnblock=async(req:Request,res:Response)=>{
    try {
      
       const response= await UserModel.findByIdAndUpdate(req.body.id,{$set:{block:req.body.updateStatus}})
      
       if(response){
            res.json({message:'updated'})
        }
    } catch (error) {
        console.log(error)
    }
}
export const addPlan=async(req:Request,res:Response)=>{
    try {
      
        const plan:SubscriptionPlan={name:req.body.datas.name,features:req.body.handleFeatureState,
            amount:req.body.datas.amount,connect:req.body.datas.connect,duration:parseInt(req.body.datas.duration)}
            
          const response=await planRepo.create(plan)
          res.json({status:response})
    } catch (error:any) {
       
        res.json(error.message)
    }
}
export const fetechPlanData=async (req:Request,res:Response)=>{
    try {
        
        const plans=await planRepo.getAllPlans()
        res.json(plans) 
    } catch (error:any) {
        res.json(error.message)
        
    }
}
export const editPlan=async(req:Request,res:Response)=>{
    try {
        
        const response=await planRepo.editPlan(req.body)
        res.json({response})
    } catch (error:any) {
        res.json({message:error.message})
    }

}
export const softDlt=async(req:Request,res:Response)=>{
    console.log(req.body)
    try {
        if(req.body.id){
            
            const response=await planRepo.softDlt(req.body.id)
            res.json({response:response})
        }else{
            throw new Error('id not found')
        }
    } catch (error:any) {
        res.json({message:error.message})
    }
}
// export const tokenAuthenticated=(req:Request,res:Response)=>{
//     if(!req.headers['authorizationforuser']){
//          res.json({auth:false,message:'authetication failed'})
//     }
//     const token=req.headers['authorizationforuser']
//     if(token&&typeof token==='string'){
//         const decode=jwtAdapter.verifyTock(token,'admin')
//         if(typeof decode==='string'){
//              res.json({auth:false,message:'authetication failed'})    
//         }
//         const isValid=decode as jwtInterface
//         const currentTime = Math.floor(Date.now() / 1000);
//                 if(isValid&&isValid.id==='123'&&isValid.role==='admin'){
//                     if(isValid.exp&&isValid.exp>currentTime){                       
//                         res.json({id:isValid.id,role:isValid.role,auth:true,message:'auth success'})
//                     }else{
//                         res.json({auth:false,message:'authetication failed'})
//                     }
//                 }
//                 else{
//                     res.json({auth:false,message:'authetication failed'})
//                 }
//     }else{
//          res.json({auth:false,message:'authetication failed'})
//     }
// }



///admin/manageUser