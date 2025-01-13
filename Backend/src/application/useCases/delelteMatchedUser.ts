import {UserRepsitories as MongoUserRepsitories } from "../../Infrastructure/repositories/userRepository";

export async function deleteMatchedUser(userId:unknown,matchedId:unknown){
    const userRepo=new MongoUserRepsitories()
    
}