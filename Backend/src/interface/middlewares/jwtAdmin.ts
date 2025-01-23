import { Request,Response,NextFunction } from "express"
import { Jwt } from "jsonwebtoken"
import { JWTAdapter } from "../../Infrastructure/jwt"
import { TokenRepository } from "../../Infrastructure/repositories/otherRepo"
export interface jwtInterface{
    id: string, role: string, iat?: number, exp?: number 
}
const jwtAdmpter=new JWTAdapter(new TokenRepository)
export const adminJwtAuthenticator=(req:Request,res:Response,next:NextFunction)=>{
  
  
   
                


const token=req.headers['authorizationforadmin']

if(token&&typeof token==='string'){
    try {
        const decode= jwtAdmpter.verifyAccessToken(token,'admin')
        const isValid=decode as jwtInterface
        if(typeof decode==='string'){
            res.json({message:'token is not valid',name:'authentication failed'})
        } const currentTime = Math.floor(Date.now() / 1000);
        if(isValid&&isValid.id==='123'&&isValid.role==='admin'){
            if(isValid.exp&&isValid.exp>currentTime){                       
                next()
              
            }else{
                res.json({message:'validation Faild',name:'authentication failed'})
                console.log('30')
            }
        }
        else{
            res.json({message:'validation Faild',name:'authentication failed'})
            console.log('34')
        }
    } catch (error:unknown) {
        if(error instanceof Error){
            console.log('37')
            res.status(405).json({message:error.message||'validation Faild',name:'authentication failed'})
        }else{
            console.log('error is not getting')
        }
    }

        
        
       
      
    }else{
        console.log('herrreee')
        res.status(405).json({message:'validation Faild',name:'authentication failed' })
    
    }
}