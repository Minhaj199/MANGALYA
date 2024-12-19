import { UserWithID } from "../../domain/entity/userEntity";
import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories";
import { getAge } from "../../interface/Utility/ageCalculator";
import { getUserProfileUseCase } from "./getUserProfile";

const userRepo=new MongoUserRepsitories()
export type updateData={
    PersonalInfo: {   
      firstName:string,  
      secondName: string, 
      state: string,      
      gender: string,     
      dateOfBirth: Date|string,    
      interest: string[]|null, 
    },
    partnerData: { gender: string },
    email: string,
  }


export async function updateData(data:updateData,id:unknown){
    if(typeof id!=='string'){
        throw new Error('id not found')
    }
    console.log(id)
    const updateData:{
        [key: string]: any;
      }={}
    if(data.PersonalInfo.firstName!==''){
        updateData['PersonalInfo.firstName']=data.PersonalInfo.firstName
    }
    if(data.PersonalInfo.secondName!==''){
        updateData['PersonalInfo.secondName']=data.PersonalInfo.secondName
    }
    if(data.PersonalInfo.state!==''){
        updateData['PersonalInfo.state']=data.PersonalInfo.state
    }
    if(data.PersonalInfo.gender!==''){
        updateData['PersonalInfo.gender']=data.PersonalInfo.gender
    }
    if(data.PersonalInfo.dateOfBirth!==''){
        
        updateData['PersonalInfo.dateOfBirth']=new Date (data.PersonalInfo.dateOfBirth)
    }
    if(data.PersonalInfo.interest!==null){
        updateData['PersonalInfo.interest']=data.PersonalInfo.interest
    }
    if(data.partnerData.gender!==''){
        updateData['partnerData.gender']=data.partnerData.gender
    }
    if(data.email!==''){
        updateData['email']=data.email
    }
    try {
        
        if(Object.keys(updateData)?.length){
            const mongoId=(id.length!==24)?id.slice(1,25):id
            const data:UserWithID=await userRepo.update(updateData as updateData,mongoId)
            if(data._id){
                const useFullData={
                    PersonalInfo:{...data.PersonalInfo,age:getAge(data.PersonalInfo.dateOfBirth)},
                    PartnerData:data.partnerData,
                    Email:data.email,
                    subscriptionStatus:data.subscriber,
                    currentPlan:data.CurrentPlan
    
               }
               return useFullData
            }
            return data
        }else{
           return getUserProfileUseCase(id)
        }
    } catch (error:any) {
        throw new Error(error.message)
    }
}