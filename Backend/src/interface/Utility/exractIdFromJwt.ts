import jwt from 'jsonwebtoken'
import { jwtInterface } from '../middlewares/jwtUser'

export  function decodeJwt(id:string){

    try {
       const data:unknown=jwt.decode(id)
       if(typeof data==='object'){
           const parsed=data as jwtInterface
           return parsed.id.slice(1,25)
       }else{
        throw new Error('error on id exraction')
       }
    } catch (error) {
        throw new Error('error on id exraction')
    }

}