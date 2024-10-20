import { Types } from "mongoose";
export interface OtpEntity{
    otp:number;
    email:string;
    createdAt?:Date
}
export interface OTPWithID extends OtpEntity{
    _id:Types.ObjectId
}