import {UserRepsitories as MongoUserRepsitories } from "../../Infrastructure/repositories/userRepository"

const userRepo=new MongoUserRepsitories()
export async function getDashData(from:unknown){
    try {
        if(typeof from!=='string'){
            throw new Error('Error on dash data fetching ')
        }
        const route= from as 'dashCount'|'SubscriberCount'|'Revenue'
        if(route==="dashCount"){
            const userCount=await userRepo.getDashCount()
            return userCount
        }else if(route==='SubscriberCount'){
            const getSubscriber=await userRepo.getSubcriberCount()
            return getSubscriber
        }else if(route==='Revenue'){
            const getRevenue=await userRepo.getRevenue()
            return getRevenue
        }
    } catch (error:any) {
        console.log(error)
        throw new Error(error.message)
    }
}