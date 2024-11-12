
import { InterestModel } from "../Infrastructure/db/signupInterest"; 

const interestData={
    sports:['Footbal','Cricket','Hockey'],
    music:['Hollywood','Bollywood','Molywood'],
    food:['Biryani', 'Sadya']
}

export async function seedInterestData(){
    try {
        const exitstingData=await InterestModel.findOne()
        if(!exitstingData){
            await InterestModel.create(interestData)
            console.log('Interest data seeded successfully')
        }
    } catch (error:any) {
        console.log(error.message)
    }
}