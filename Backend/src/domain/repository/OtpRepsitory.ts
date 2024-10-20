import { OtpEntity,OTPWithID } from "../entity/otpEntity";

export interface OTPrespository{
    create(otpData:OtpEntity):Promise<OTPWithID>,
    otpValidation(otp:string,email:string):Promise<boolean>
}
