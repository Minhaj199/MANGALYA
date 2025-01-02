import { Types } from "mongoose";
import { UserModel } from "../../Infrastructure/db/userModel";

export async function getUserRequest (id:string){
    try {
        const user=await UserModel.aggregate([{$match:{_id:new Types.ObjectId(id)}},
            {$project:{_id:'$_id',photo:'$PersonalInfo.image',name:'$PersonalInfo.firstName'}}])
            if(user){
                return {...user[0]}    
            }else{
                return 'got user'
            }
    } catch (error:any) {
        throw new Error(error.message||'error on request injection')
    }
}