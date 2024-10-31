import {verify,JwtPayload} from "jsonwebtoken"
import { jwtInterface } from "../interface/middlewares/jwtUser"
export function getId(token:string){
    try {
        
        const decoded:JwtPayload|string=verify(token,process.env.JWT_SECRET_USER||'321321')
        
        if(decoded&&typeof decoded!=='string'&&decoded.id){
                        return decoded.id
        }else{
            
            
            throw new Error("error on get id")
        }  
        
    } catch (error:any) {
        console.log(18)
        throw new Error(error)
    }
    
}