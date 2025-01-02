import { Types } from "mongoose";
import { messageModel } from "../../Infrastructure/db/messageModel";

export async function createText(chatid:string,senderIdString:string,text:string){
    try {
        const data=new messageModel({
            chatId:new Types.ObjectId(chatid),senderId:senderIdString,text
        })
        const response=await data.save()
        if(response){
            return true
        }else{
            throw new Error('error on chat')
        }
    } catch (error:any) {
        console.log(error)
        throw new Error(error.message)
    }
}