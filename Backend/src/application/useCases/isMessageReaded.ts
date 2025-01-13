import { resolveContent } from "nodemailer/lib/shared";
import { messageModel } from "../../Infrastructure/db/messageModel";

export async function isMessageReaded(from:unknown,ids:string[]){

    try {
        if(from==='nav'){

            const response:{acknowledged:boolean}=await messageModel.updateMany({_id:ids},{viewedOnNav:true})
            console.log(response)
            if(response.acknowledged){
                return true
            }
        }
    } catch (error) {
        console.log(error)
        return false
    }
}