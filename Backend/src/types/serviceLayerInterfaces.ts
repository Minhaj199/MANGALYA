import { ChatMessage, ExtentedMatchProfile, fetechProfileDataType, FirstBatch, IMessage, IMessageWithoutId,  MatchedProfile, RequestInterface, SubscriptionPlanDocument, suggestionType, updateData, UserCurrentPlan, userProfileReturnType, UserWithID } from "./TypesAndInterfaces" 
import { User } from "../domain/entity/userEntity"
import { Token } from '@stripe/stripe-js';
import { AbuserReport } from "../domain/entity/abuse";


export interface AuthSeviceInteface{
    signupFirstBatch(firstBatch:FirstBatch):Promise<{user:User,token:string}>
    login(email:string,password:string):Promise<
    {token:string,name:string,partner:string,photo:string,gender:string,subscriptionStatus:string}
    >
    passwordChange(email:string,password:string):Promise<boolean>
    changePasswordEditProfile(password:unknown,id:unknown):Promise<boolean>
    degenerateToken(id:unknown,role:'user'|'admin',preferedGender:string,gender:string):string
}

export interface ChatServiceInterface{
    fetchChats(user:unknown,secondUser:unknown):Promise<{chatRoomId:string}>
    createMessage(chatRoomId:string,senderId:string,text:string,image:boolean):Promise<IMessage>
    fetchUserForChat(id:string):Promise<{name:string,photo:string}>
    }
export interface FixedDataServiceInterface{
    creatInterest():Promise<void>
    createFeatures():Promise<void>
}
export interface PhotoServiceInterface{
    upload(path:string):string
}
export interface interestServiceInterface{
    fetchInterestAsCategory():Promise<{sports:string[],music:string[],food:string[]}|undefined>    
}
export interface MessageServiceInterface{
    createMessage(data:IMessageWithoutId):Promise<IMessageWithoutId>
    findAllMessage(id:string):Promise<ChatMessage[]>
    updateReadedMessage(id:string):Promise<void>
    fetchMessageCount(from:unknown,id:unknown):Promise<{count:number,ids:string[]}>
    makeAllUsersMessageReaded(from:unknown,ids:string[]):Promise<boolean>
    createImageUrl(path:string):Promise<string>
}

export interface OtpRepositoryInterface{
    ForgetValidateEmail(email:string):Promise<UserWithID | null>
    otpVerification(email: string, from: string):Promise<boolean>
    otpVerificationForForgot(email: string, from: string):Promise<boolean>
    otpValidation(email: string, otp: string, from: string):Promise<boolean>
    otpDispatchingForEditProfile(id: unknown):Promise<boolean>
    validateOtpForEditProfiel(id: unknown, otp: unknown, from: string):Promise<string>
}
export interface ParnterServiceInterface{
    addMatch(userId: unknown, matchedId: string,): Promise<boolean>
    manageReqRes(requesterId: string, userId: unknown,action: string):Promise<boolean>
    fetechProfileData(userId:string,userGender:string,partnerGender:string):Promise<fetechProfileDataType>
    fetchUserForLandingShow():Promise< { name: string; age: number; image: string }[]|[]>
    matchedProfiles(id:unknown):Promise<MatchedProfile[] | { formatedResponse: ExtentedMatchProfile[]; Places: string[]; onlines: string[]; }>    
    deleteMatchedUser(userId:unknown,partnerId:string):Promise<boolean>
    createRequeset(id:string):Promise<RequestInterface[]>
}
export interface PaymentSeriviceInterface{
     purchase(plan:UserCurrentPlan,token:Token,email:string,userId:string):Promise<boolean>
}
export interface PlanServiceInterface {
    fetchAll():Promise<SubscriptionPlanDocument[] | []>
}
export interface ReportAbuse{
    checkingDupliacateComplaint(id: string, reason: string, profileId: string): Promise<AbuserReport | null>
    createReport(userId: unknown, reporedId: string, reason: string, moreInfo: string): Promise<boolean>
}
export interface UserProfileSeriviceInterface{
    uploadPhoto(path: string, email: string): Promise<string | false>
    uploadInterest(intersts: string[], email: string): Promise<boolean>
    fetchUserProfile(id:unknown):Promise<userProfileReturnType>
    updateEditedData(data:updateData,id:unknown):Promise<{data:userProfileReturnType,token:string|boolean}>
    fetchUserByID(id:unknown):Promise<string>
    fetchName(id: string): Promise<string>
}