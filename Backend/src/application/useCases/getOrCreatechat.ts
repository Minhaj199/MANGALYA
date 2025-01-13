// import { Types } from "mongoose";
// import { chatModel } from "../../Infrastructure/db/chatModel";
// import { messageModel } from "../../Infrastructure/db/messageModel";

// export async function getOrCreatechat(reciever:unknown,sender:unknown){
//     if(typeof reciever==='string'&&typeof sender==='string'){
//         try {
//             const chat:{_id:Types.ObjectId}|null=await chatModel.findOne({
//                 members :{$all:[new Types.ObjectId(sender.slice(1,25)),new Types.ObjectId(reciever)]}
//             }).populate('members','PersonalInfo.firstName PersonalInfo.image')
//             if(chat) {
//                 const messages=await messageModel.find({chatId:chat._id})
//                 return {chatRoomData:chat,allMessages:messages}
//             }

//             const newChat=new chatModel({
//                 members:[new Types.ObjectId(sender.slice(1,25)),new Types.ObjectId(reciever)]
//             })
//             const response:{_id:Types.ObjectId}=await newChat.save()
//             if(response){
//             const newRosponse=await chatModel.findOne({_id:response._id}).populate('members','PersonalInfo.firstName PersonalInfo.image')
//                 return {chatRoomData:newRosponse,AllMessages:[]}
//         }
            
//         } catch (error:any) {
//             console.log(error)
//             throw new Error(error.message)
//         }
//     }
// }