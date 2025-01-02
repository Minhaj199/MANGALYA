import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories";

export async function deleteMatchedUser(userId:unknown,matchedId:unknown){
    const userRepo=new MongoUserRepsitories()
    try {
       
        if(typeof userId==='string'&&typeof matchedId==='string'){
            const response=await userRepo.deleteMatched(userId,matchedId)
            return response
        }else{
            throw new Error('error on ids')
        }
    } catch (error:any) {
        throw new Error(error.message||'error on deletion')
    }
}