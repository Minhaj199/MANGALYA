import {User,UserWithID} from "../entity/userEntity";
import { userForLanding } from "../../application/types/userTypes";

export interface UserRepository{
    create(user:User):Promise<UserWithID>;
    findByEmail(email:string):Promise<UserWithID|null>
    // update(user:User):Promise<void>
    addPhoto(photo:string,email:string):Promise<boolean>
    addInterest(interst:string[],email:string):Promise<boolean>
    addMatch(userId:string,matchedId:string,):Promise<boolean>
    manageReqRes(requesterId:string,userId:string,action:string):Promise<boolean>
    getUsers():Promise<userForLanding[]>
}