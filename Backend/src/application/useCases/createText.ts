import { Types } from "mongoose";
import { messageModel } from "../../Infrastructure/db/messageModel";

export async function createText(chatid:string,senderIdString:string,text:string,photo:boolean){
    try {
        const data=new messageModel({
            chatId:new Types.ObjectId(chatid),senderId:senderIdString,text,viewedOnNav:false,viewedList:false,
            image:photo
        })
        const response=await data.save()
        console.log(response)
        if(response){
            return response
        }else{
            throw new Error('error on chat')
        }
    } catch (error:any) {
        console.log(error)
        throw new Error(error.message)
    }
}