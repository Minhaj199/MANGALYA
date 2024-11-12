import { featureModel } from "../Infrastructure/db/featureModel";


const features=['Video call','Unlimited message','Suggestion','Priority']


export async function featureSeed(){
    const isExist=await featureModel.findOne()
    if(!isExist){
         await featureModel.create({features})
         console.log('features added')
    }

}