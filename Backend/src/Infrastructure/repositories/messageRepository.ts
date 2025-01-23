import { Types } from "mongoose"
import { MessageRepositoryInterface } from "../../domain/interface/messageRepository"
import { IMessage } from "../../types/TypesAndInterfaces"
import { messageModel } from "../db/messageModel"
import BaseRepository from "./baseRepository"

export class MessageRepository extends BaseRepository<IMessage>implements MessageRepositoryInterface{
    constructor(){
      super(messageModel)
    }
    async findMessages(chatRoomId:unknown):Promise<IMessage[]|[]>{
      if(typeof chatRoomId!=='string'){
        throw new Error('interanal server error on message fetching')
      }
      try {
        const data=await this.model.find({chatRoomId}).sort({createdAt:1}) 
        return data
      } catch (error:any) {
        throw new Error(error.message||'internal server error')
      }
    }
    async findAllMessage(chatRoomId:string):Promise<IMessage[]|[]>{
      try {
       return await messageModel.find({chatRoomId:chatRoomId},{_id:0,text:1,createdAt:1,senderId:1,image:1}).sort({createdAt:1})
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
    async updateReadedMessage(id: string): Promise<void> {
      try {
        await this.model.updateMany({chatRoomId:new Types.ObjectId(id)},{viewedOnNav:true,viewedList:true})      
      } catch (error:any) {
        throw new Error(error.message)
      }
      
    
    }
    
    async updatAllMessagesReaded(ids: string[]): Promise<boolean> {
      if(!Array.isArray(ids)||ids?.length<0){
        return true
      }
      try {
       const data= await this.model.updateMany({_id:ids},{viewedOnNav:true})
      return true
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
  }