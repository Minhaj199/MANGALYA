
import { ChatRepository } from "../../domain/interface/chatRoomRepository";
import { MessageRepository } from "../../Infrastructure/repositories/messageRepository"; 
import { Cloudinary } from "../../interface/utility/cloudinary";
import { MessageServiceInterface } from "../../types/serviceLayerInterfaces";
import {  ChatMessage,  IMessageWithoutId, } from "../../types/TypesAndInterfaces";



export class MessageService implements MessageServiceInterface{
    private messageRepo:MessageRepository
    private chatRepositroy:ChatRepository
    private photoCloud:Cloudinary
    constructor(messageRepo:MessageRepository,chatRepositroy:ChatRepository,photoCloud:Cloudinary){
        this.messageRepo=messageRepo
        this.chatRepositroy=chatRepositroy
        this.photoCloud=photoCloud    
    }
    async createMessage(data:IMessageWithoutId){
        try {
            
           return this.messageRepo.create(data)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async findAllMessage(id:string){
        try {
        const get_All_Messages=await this.messageRepo.findAllMessage(id)
            if(get_All_Messages?.length>0){              
                const final:ChatMessage[]=get_All_Messages.map((message)=>{
                    return {
                        senderId:message.senderId,
                        text: message.text,
                        image: message.image,
                        createdAt:message.createdAt}
                })
                await this.updateReadedMessage(id)
                return final
            }
       
        await this.updateReadedMessage(id)
        return get_All_Messages
        } catch (error:any) {
            throw new Error(error.message)  
        }
    }
    async updateReadedMessage(id:string){
        try {
            
            await this.messageRepo.updateReadedMessage(id)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
     async  fetchMessageCount(from:unknown,id:unknown){
        
        try {
            if(typeof from==='string'&&typeof id==='string'){
                const response=await this.chatRepositroy.fetchDatasForCount(id)
                if(response.length>=1){
           
            const ids:string[]=[]
            response.forEach((el)=>{
                   ids.push((el.chats._id ))
            })
            if(ids.every((el)=>typeof el==='string')){
                return {count:ids.length,ids:ids}
            }else{
                return {count:ids.length,ids:[]}
            }
        }else{
            return {count:0,ids:[]}
        }

            }else{
                throw new Error('error id type missmatch')
            }
        } catch (error:any) {
            throw new Error(error.message||'error fetching message count')
        }
    }
    async makeAllUsersMessageReaded(from:unknown,ids:string[]){
      
        try {
            if(typeof from==='string'){
                if(from==='nav'){

                    await this.messageRepo.updatAllMessagesReaded(ids)
                    
                    return true
                }else{
                   
                    return false
                }
            }else{
               
                return false
            }
        } catch (error:any) {
          
            throw new Error(error.message)
        }
    }
    async createImageUrl(path:string){
        try {
            
            const response = await this.photoCloud.upload(path)
            if(typeof response==='string'){

                return response
            }else{
                return ''
            }
        } catch (error:any) {
            throw new Error(error.message||'error on photo upload')
        }
    }
}