import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories";
import { getAge } from "../../interface/Utility/ageCalculator";
import { MatchedProfile } from "../types/userTypes";

type ExtentedMatchProfile=MatchedProfile&{age:number}
export async function matchedUsers( id:unknown){
const mongoRepo=new MongoUserRepsitories()
try {

    if(typeof id==='string'){
        let formatedResponse:ExtentedMatchProfile[]=[]
        let Places:string[]=[]
        const response:MatchedProfile[]|[]=await mongoRepo.getMatchedRequest(id)
        if(response.length){
            response?.forEach(element => {
                formatedResponse.push({...element,age:getAge(element.dateOfBirth)})
                if(!Places.includes(element.state))
                Places.push(element.state)
            });
            return {formatedResponse,Places}
        }
        if(response.length===0){
            return response
        }
    }else{
        throw new Error('id not found')
    }
    
} catch (error:any) {
    throw new Error(error.message||'error on request fetching')
}

}