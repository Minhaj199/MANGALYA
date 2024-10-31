import { Request,Response,NextFunction } from "express"
import { Jwt } from "jsonwebtoken"
import { JWTAdapter } from "../../Infrastructure/jwt"
export interface jwtInterface{
    id: string, role: string, iat?: number, exp?: number 
}
const jwtAdmpter=new JWTAdapter()
export const userJwtAuthenticator=(req:Request,res:Response,next:NextFunction)=>{
const token=req.headers['authforuser']

if(token&&typeof token==='string'){
const decode= jwtAdmpter.verifyTock(token,'user')

        if(typeof decode==='string'){
            res.json({message:'token is not valid'})
        }
        const isValid=decode as jwtInterface
        
        const currentTime = Math.floor(Date.now() / 1000);
                if(isValid&&isValid.role==='user'){
                    if(isValid.exp&&isValid.exp>currentTime){                       
                        next()
                    }else{
                        res.json({message:'validation Faild'})
                    }
                }
                else{
                    res.json({message:'validation Faild'})
                }
      
    }else{
        res.json({message:'validation Faild'})
    
    }
}