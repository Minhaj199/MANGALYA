import { Types } from "mongoose";
import { UserRepository } from "../../domain/interface/userRepositoryInterface";
import { ChatRoomRepository } from "../../Infrastructure/repositories/chatRepository"; 
import { MessageService } from "./messageServie";
import { ChatRoom, FetchedChat, IMessage, IMessageWithoutId } from "../../types/TypesAndInterfaces";
import { objectIdToString } from "../../interface/Utility/objectIdToString";
import { ChatServiceInterface } from "../../types/serviceLayerInterfaces";



export class ChatService implements ChatServiceInterface{
    private userRepo:UserRepository
    private chatRoomRepo:ChatRoomRepository
    private messageService:MessageService
    constructor(userRepo:UserRepository,chatRoomRepo:ChatRoomRepository,messageService:MessageService){
        this.userRepo=userRepo
        this.chatRoomRepo=chatRoomRepo
        this.messageService=messageService
    }
    async fetchChats (user:unknown,secondUser:unknown){
        if(typeof user==='string'&&typeof secondUser==='string'){
            try {
                const chat:ChatRoom|null=await this.chatRoomRepo.findChatRoomWithIDs(user,secondUser)
                
                if(chat&&chat._id) {
                    
                    return {chatRoomId:objectIdToString (chat._id)}
                }
                const data={
                    members:[new Types.ObjectId(user),new Types.ObjectId(secondUser)]
                }
                const response=await this.chatRoomRepo.create(data)
                
                if(response&&response._id){
    
                    return {chatRoomId:objectIdToString(response._id)}
                }else{
                    throw new Error('Internal server error on chat')
                }
            }
               
             catch (error:any) {
                console.log(error)
                throw new Error(error.message)
            }
        }else{
            throw new Error('internal server error on fetch Chat')
        }
    }
    async createMessage(chatRoomId:string,senderId:string,text:string,image:boolean){
        try {
            const data:IMessageWithoutId={
                chatRoomId:new Types.ObjectId(chatRoomId),
                senderId:new Types.ObjectId(senderId),
                viewedOnNav: false,
                viewedList:false,
                text:text,
                image:image
            }
            return this.messageService.createMessage(data) 
        } catch (error:any) {
            throw new Error(error.message)
            
        }
       
    }
    async fetchUserForChat(id:string){
        try {
            const userData=await this.userRepo.getUserProfile(id)
            return {name:userData.PersonalInfo.firstName?userData.PersonalInfo.firstName:'',
                photo:(userData.PersonalInfo?.image)?userData.PersonalInfo?.image:''}
        } catch (error:any) {
            throw new Error(error.message||'internal server error on userfetch')
        }
    }
}