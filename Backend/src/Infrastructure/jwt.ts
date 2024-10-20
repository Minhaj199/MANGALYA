import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

export class JWTAdapter{
    createToken(information:{id:string,role:string},key:string,option:{expiresIn:string}){
      
        return jwt.sign(information,key,option)
    }
}