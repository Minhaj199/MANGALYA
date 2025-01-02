import mongoose, { Types } from "mongoose";

const messageSchema=new mongoose.Schema({
    chatId:mongoose.Schema.ObjectId,
    senderId:{type:mongoose.Schema.ObjectId,ref:'User'},
    text:String
},{
    timestamps:true
})

export const messageModel=mongoose.model('messages',messageSchema)