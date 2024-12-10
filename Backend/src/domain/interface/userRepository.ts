import {User,UserWithID} from "../entity/userEntity";
import { profileTypeFetch, userForLanding } from "../../application/types/userTypes";
import { updateData } from "../../application/useCases/updateData";

export interface UserRepository{
    create(user:User):Promise<UserWithID>;
    findByEmail(email:string):Promise<UserWithID|null>
    update(user:updateData,id:string):Promise<UserWithID>
    addPhoto(photo:string,email:string):Promise<boolean>
    addInterest(interst:string[],email:string):Promise<boolean>
    addMatch(userId:string,matchedId:string,):Promise<boolean>
    manageReqRes(requesterId:string,userId:string,action:string):Promise<boolean>
    getUsers():Promise<userForLanding[]>
    getSearch(data:string,gender:string,preferedGender:string):Promise<profileTypeFetch|[]>
    findEmailByID(id:unknown):Promise<string>
    getUserProfile(id:string):Promise<UserWithID>
    getDashCount():Promise<{MonthlyRevenue:number,SubscriberCount:number,UserCount: number}>
    getSubcriberCount():Promise<number[]>
    getRevenue():Promise<{ month: number[], revenue:number[]}>
}