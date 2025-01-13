import mongoose, { Types } from "mongoose";
import { IMessage } from "../../types/TypesAndInterfaces";

const messageSchema=new mongoose.Schema<IMessage>({
    chatRoomId:mongoose.Schema.ObjectId,
    senderId:{type:mongoose.Schema.ObjectId,ref:'User'},
    text:String,
    viewedOnNav:Boolean,
    viewedList:Boolean,
    image:Boolean

},{
    timestamps:true
})

export const messageModel=mongoose.model<IMessage>('messages',messageSchema)