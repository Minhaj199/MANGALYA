import mongoose,{Schema,Document} from "mongoose";
import { OtpEntity } from "../../domain/entity/otpEntity";

export interface IOtpModel extends OtpEntity,Document{}

const otpSchma=new Schema<IOtpModel>({
    otp:{type:Number,required:true},
    email:{type:String,required:true},
    createdAt:{type:Date,default:Date.now,expires:'2m'}
})

export const OtpModel=mongoose.model<IOtpModel>('Otps',otpSchma)