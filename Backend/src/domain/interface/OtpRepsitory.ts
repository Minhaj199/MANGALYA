import { OtpEntity } from "../entity/otpEntity";

export interface OTPrespository{
    create(otpData:OtpEntity):Promise<OtpEntity>,
    getOTP(email:string,from:string):Promise<OtpEntity|[]>
}
