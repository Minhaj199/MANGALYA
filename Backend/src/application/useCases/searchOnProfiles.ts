
import {UserRepsitories as MongoUserRepsitories } from "../../Infrastructure/repositories/userRepository"
import { getAge } from "../../interface/Utility/ageCalculator"
import { profileTypeFetch } from "../../types/TypesAndInterfaces"

const userRepo=new MongoUserRepsitories()
export async function searchOnProfile(data:string,gender:string,preferedGender:string){
    try {
        const datas:profileTypeFetch|[]=await userRepo.getSearch(data,gender,preferedGender)
        let response:any=[]
        if(data.length!==0){
            response=datas.map((el,index)=>{
                return ({
                    ...el,no:index+1,age:getAge(el.dateOfBirth)
                })
            })
            return response
        }else{
            return data
        }
    } catch (error:any) {
        console.log(error)
        throw new Error(error.massage)
    }
}