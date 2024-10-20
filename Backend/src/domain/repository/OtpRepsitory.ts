import { OtpEntity,OTPWithID } from "../entity/otpEntity";

export interface OTPrespository{
    create(otpData:OtpEntity):Promise<OTPWithID>
}
