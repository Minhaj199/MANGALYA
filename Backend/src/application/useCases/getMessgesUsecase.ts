import { messageModel } from "../../Infrastructure/db/messageModel"
import { updateReadedMessage } from "./udateReadedMessage"


export async function getMessgesUsecase(id:string){
  
    try {
        const get_All_Messages=await messageModel.find({chatId:id},{_id:0,text:1,createdAt:1,senderId:1,image:1}).sort({createdAt:1})
        await updateReadedMessage(id)
        return get_All_Messages
        
    } catch (error:any) {
        throw new Error(error.message||'error on message')
    }
}