import { messageModel } from "../../Infrastructure/db/messageModel";

 export async function updateReadedMessage(chatroomId:string){
    await messageModel.updateMany({chatId:chatroomId},{viewedOnNav:true,viewedList:true})
}