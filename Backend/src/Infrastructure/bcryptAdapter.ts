import bcrypt from 'bcryptjs'


export class BcryptAdapter{
    async hash(password:string):Promise<string>{
        return await bcrypt.hash(password,10)
    }
    async compare(password:string,hashed:string):Promise<boolean>{
        return await bcrypt.compare(password,hashed)
    }
}