import { UserRepository} from "../../domain/repository/userRepository";
import { UserModel } from "../db/userModel";
import { OtpModel } from "../db/otpModel";
import { User,UserWithID } from "../../domain/entity/userEntity";
import { OtpEntity,OTPWithID } from "../../domain/entity/otpEntity";
import { OTPrespository } from "../../domain/repository/OtpRepsitory";



export class MongoUserRepsitories implements UserRepository{
   async create(user: User): Promise<UserWithID> {
        const newUser=new UserModel(user)
        const savedUser=await newUser.save()
        return savedUser.toObject() as UserWithID
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
}