import { Request,Response } from "express";
import { AdminAuth } from "../../application/admin/auth/authService";
import { UserModel } from "../../Infrastructure/db/userModel";


const adminAuthentication=new AdminAuth()
export const login=(req:Request,res:Response)=>{
   console.log(req.body)
    try {
        const {email,password}=req.body
        const isValid=adminAuthentication.login(email,password)
       
        if(isValid?.message==='admin verified'){          
            res.json({adminVerified:true,tocken:isValid.token})
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
        
        const data=await UserModel.find().sort({_id:-1})
        const processedData=data.map((el,index)=>({
            ...el.toObject(),
            expiry:el.expiry.toDateString(),
            no:index+1
        }))
        
        res.json(processedData)
    } catch (error) {
        
    }
}



///admin/manageUser