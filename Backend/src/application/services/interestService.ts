import { InterestRepo } from "../../Infrastructure/repositories/otherRepo" 
import { interestServiceInterface } from "../../types/serviceLayerInterfaces" 

export class InterestServiece implements interestServiceInterface {
    private interestRepo:InterestRepo
    constructor(interest:InterestRepo){
        this.interestRepo=interest
    }
   async fetchInterestAsCategory(){
    try {
        const data= await this.interestRepo.getInterestAsCategory( )
        if(data){
            return data   

        }  else{
            throw new Error('interest not found')
        }
    } catch (error:any) {
        throw new Error(error.message)
    }
     
    }
}