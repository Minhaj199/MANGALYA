import {User} from "../entity/userEntity";
import { adminPlanType, LandingShowUesrsInterface, PlanOrder, RequestInterface, suggestionType, UserWithID } from "../../types/TypesAndInterfaces";
import { MatchedProfile, profileTypeFetch } from "../../types/TypesAndInterfaces";
import { updateData } from "../../types/TypesAndInterfaces"; 

import { subscriptionPlanModel } from "../../Infrastructure/db/planModel";
import { IUserModel } from "../../Infrastructure/db/userModel";



export interface UserRepository{
    create(user:User):Promise<UserWithID>;
    findByEmail(email:string):Promise<UserWithID|null>
    update(user:updateData,id:string):Promise<UserWithID>
    addPhoto(photo:string,email:string):Promise<boolean>
    addInterest(interst:string[],email:string):Promise<boolean>
    addMatch(userId:string,matchedId:string,user:UserWithID):Promise<boolean>
    manageReqRes(requesterId:string,userId:string,action:string):Promise<boolean>
    getUsers():Promise<LandingShowUesrsInterface[]|[]>
    getSearch(data:string,gender:string,preferedGender:string):Promise<profileTypeFetch|[]>
    findEmailByID(id:unknown):Promise<{email:string}>
    getUserProfile(id:string):Promise<UserWithID>
    getDashCount():Promise<{subscriberGroups:{ _id:string, count:number}[],totalCount:number}>
    getSubcriberCount():Promise<{_id:string,count:number}[]>
    getRevenue():Promise<{ _id:string, total: number }[]>
    getMatchedRequest(id:string):Promise<MatchedProfile[]|[]>
    deleteMatched(id:string,matched:string):Promise<boolean>
    changePassword(email:string,hashedPassword:string):Promise<boolean>
    fetchPartnerProfils(userId:string,userGender:string,partnerGender:string):Promise<{profile:profileTypeFetch,request:profileTypeFetch}[]>
    getCurrentPlan(userId:string):Promise<{CurrentPlan:subscriptionPlanModel}[]|[]>
    addPurchaseData(userId:string,id:string,data:PlanOrder):Promise<boolean>
    fetchSuggetions(id:string,gender:string,partnerPreference:string):Promise<{profile:suggestionType[]|[],request:profileTypeFetch|[],userProfile:IUserModel[]|[]}[]>
    createRequest(id:string):Promise<RequestInterface[]>
    findEmail(email:string):Promise<UserWithID|null>
    fetchName(id:string):Promise<string>
    fetchUserDataForAdmin(): Promise<{username:string,email:string,match:{_id:string,status:string,typeOfRequest:string}[],subscriber:string,CreatedAt:Date,block:boolean}[]|[]>
    fetchSubscriber():Promise<adminPlanType[]|[]>
    blockAndUnblockUser(id:string,action:boolean):Promise<boolean>
}
