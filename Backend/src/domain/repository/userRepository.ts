import {User,UserWithID} from "../entity/userEntity";


export interface UserRepository{
    create(user:User):Promise<UserWithID>;
    findByEmail(email:string):Promise<UserWithID|null>
    // update(user:User):Promise<void>
}