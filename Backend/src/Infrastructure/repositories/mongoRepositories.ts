import { UserRepository} from "../../domain/repository/userRepository";
import { UserModel } from "../db/userModel";
import { OtpModel } from "../db/otpModel";
import { User,UserWithID } from "../../domain/entity/userEntity";
import { OtpEntity,OTPWithID } from "../../domain/entity/otpEntity";
import { OTPrespository } from "../../domain/repository/OtpRepsitory";



export class MongoUserRepsitories implements UserRepository{
   async create(user: User): Promise<UserWithID> {
    try {
        
        const newUser=new UserModel(user)
        const savedUser=await newUser.save()
        return savedUser.toObject() as UserWithID
    } catch (error:any) {
        throw new Error(error.message)
    }
    }
    async findByEmail(email: string): Promise<UserWithID|null> {
        
        const user=await UserModel.findOne({email}).lean()
        
        return user as UserWithID|null
    }
    
    
}
export class MongoOtpRepository implements OTPrespository{
    async create(otpData:OtpEntity): Promise<OTPWithID> {
    const newOTP=new OtpModel(otpData)
    const savedOTP=await newOTP.save()
    return newOTP as OTPWithID
    }
    async otpValidation(otp: string,email:string): Promise<boolean> {
        try {
            // const otpDoc=await OtpModel.findOne({email:email}).sort({id:-1}).limit(1).lean()
            const otpDoc=await OtpModel.aggregate([{$match:{email:email}},{$sort:{_id:-1}},{$limit:1}])
            console.log(otpDoc)
            console.log(otpDoc[0])
            const otpParsed:number=parseInt(otp)
            if(otpDoc){
                if(otpDoc[0].email===email&&otpDoc[0].otp===otpParsed){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }    
        } catch (error) {
            throw new Error('otp failure')
        }
        
    }

}