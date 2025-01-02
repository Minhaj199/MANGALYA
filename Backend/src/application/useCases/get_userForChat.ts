import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories"

export async function get_userForChat(id:string){
    const mongoRepo=new MongoUserRepsitories()
    try {
        const userData=await mongoRepo.getUserProfile(id)
        return {name:userData.PersonalInfo.firstName,photo:(userData.PersonalInfo?.image)?userData.PersonalInfo?.image:''}
    } catch (error) {
        
    }
}