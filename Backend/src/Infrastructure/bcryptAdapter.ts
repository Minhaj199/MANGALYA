import bcrypt from 'bcryptjs'
import User from '../interface/routes/userRoutes'

export class BcryptAdapter{
    async hash(password:string):Promise<string>{
        return await bcrypt.hash(password,10)
    }
    async compare(password:string,hashed:string):Promise<boolean>{
        return await bcrypt.compare(password,hashed)
    }
}