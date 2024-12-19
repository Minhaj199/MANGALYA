import { UserWithID } from "../../domain/entity/userEntity"
import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories"
import { getAge } from "../../interface/Utility/ageCalculator"


const userRepo=new MongoUserRepsitories()
export async function getUserProfileUseCase(id:unknown){
   
    try {
        if(typeof id==='string'){
       
               const data:UserWithID=await userRepo.getUserProfile(id)
           const useFullData={
                PersonalInfo:{...data.PersonalInfo,age:getAge(data.PersonalInfo.dateOfBirth)},
                PartnerData:data.partnerData,
                Email:data.email,
                subscriptionStatus:data.subscriber,
                currentPlan:data.CurrentPlan

           }
           
           return useFullData
        }else{
            throw new Error('id not found')
        }    
    } catch (error:any) {
      console.log('get profile here')
        throw new Error(error.message||'id not fount')
    }
    
}