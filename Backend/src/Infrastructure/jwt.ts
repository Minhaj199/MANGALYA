import jwt from 'jsonwebtoken'

import { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'

export class JWTAdapter{
    createToken(information:{id:string,role:string,preferedGender?:string,gender?:string},key:string,option:{expiresIn:string}){
     
        const {id,role,preferedGender='no parnter',gender='not available'} =information
        return jwt.sign({id,role,preferedGender,gender},key,option)
    }
    verifyTock(token:string,from:string){
        try {
            if(from==='admin'){ 
                const decode=jwt.verify(token,process.env.JWT_SECRET_ADMIN||'123')
                return decode
            }else if(from==='user'){
                const decode=jwt.verify(token,process.env.JWT_SECRET_USER||'123')
                return decode
            }

            
        } catch (error:any) {
           throw new Error(error?.TokenExpiredError||'validation Faild') 
        }
    }
    
}