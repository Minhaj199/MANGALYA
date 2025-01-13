import { Request,Response,NextFunction } from "express"
import { Jwt } from "jsonwebtoken"
import { JWTAdapter } from "../../Infrastructure/jwt"
export interface jwtInterface{
    id: string, preferedGender:string,
    gender:string, role: string, iat?: number, exp?: number 
}
declare global{
    namespace Express{
        interface Request{
            userID?:string,
            preferedGender:string,
            gender:string
        }
    }
}
const jwtAdmpter=new JWTAdapter()
export const userJwtAuthenticator=(req:Request,res:Response,next:NextFunction)=>{
const token=req.headers['authforuser']

if(token&&typeof token==='string'){
    try {
        const decode= jwtAdmpter.verifyTock(token,'user')
        if(typeof decode==='string'){
            res.json({message:'token is not valid'})
        }
        const isValid=decode as jwtInterface
        const currentTime = Math.floor(Date.now() / 1000);
                if(isValid&&isValid.role==='user'){
                    if(isValid.exp&&isValid.exp>currentTime){  
                        
                        req.userID=isValid.id.slice(1,25) 
                        req.gender=isValid.gender
                        req.preferedGender=isValid.preferedGender                 
                        next()
                    }else{
                        res.status(401).json({message:'Token expired'})
                    }
                }
                else{
                    res.json({message:'validation Faild'})
                }
        
    } catch (error:any) {
        console.log(error)
        res.json({message:error?.TokenExpiredError||'validation Faild'})
    }
    }else{
       
        res.status(500).json({message:'validation Faild'})
    
    }
}