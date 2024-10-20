import jwt from 'jsonwebtoken' 
import { JWTAdapter } from '../../../Infrastructure/jwt'
export class AdminAuth{
    private jwtGenerator:JWTAdapter

    constructor(){
        this.jwtGenerator=new JWTAdapter()
    }

    login(email:string,password:string){
        try {
            
            const adminEmail=process.env.ADMIN_USERNAME
            const adminPassword=process.env.ADMIN_PASSWORD
            const jwt_key=process.env.JWT_SECRET_ADMIN
            if(adminEmail===email){
                if(adminPassword===password){
                    if(!jwt_key){
                        throw new Error('secret key is not found')
                    }else{   
                        const JWT_SECRET=jwt_key
                        const token=this.jwtGenerator.createToken({id:'123',role:'admin'},JWT_SECRET,{expiresIn:'1 hour'})
                        return {message:'admin verified',token}
                    }
    
                }else{
                    return {message:"password not matching"}                   
                }
            }else{
              
                return {message:'user name not found'}
            }
        } catch (error) {
           
            console.log(error)
        }
       
    }

}