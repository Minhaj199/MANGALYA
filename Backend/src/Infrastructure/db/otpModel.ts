import mongoose,{Schema,Document} from "mongoose";
import { OtpEntity } from "../../domain/entity/otpEntity";

export interface IOtpModel extends OtpEntity,Document{}

const otpSchema=new Schema<IOtpModel>({
    otp:{type:Number,required:true},
    email:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

export const OtpModel=mongoose.model<IOtpModel>('Otps',otpSchema)