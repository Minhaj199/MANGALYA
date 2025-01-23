import { Socket } from "socket.io"
import { io } from "./server"
import { socketIdMap } from "./server"
import { PartnerProfileService } from "./application/services/partnersProfileService"
import { UserProfileService } from "./application/services/userService"
import { MessageService } from "./application/services/messageServie"
import { JWTAdapter } from "./Infrastructure/jwt"
import { AuthService } from "./application/services/authService"


export const socketMethod=(socket:Socket,partnerService:PartnerProfileService,userProfileService:UserProfileService,messageService:MessageService,jwtService:JWTAdapter,authService:AuthService)=>{
    socket.on('register_user',(data:{userId:string})=>{ 
       
        try {
           
            if(data.userId){
                const userId=jwtService.decodeAccessToken(data.userId)
                if(userId){
                    socketIdMap.set(userId,socket.id)
                    io.emit('newUserOnline',{id:userId})
                }else{
                    throw new Error('user id not found')  
                }
               
        }else{
            throw new Error('user id not found')
        }
        
       
      } catch (error:any) {
        io.to(socket.id).emit('errorFromSocket',{message:error.message||'error on user registration'})
      }  
    
    
    })
    socket.on('request_send',async(data:{sender:string,reciever:string})=>{
        try {

            const senderId=jwtService.decodeAccessToken(data.sender)
           if(!senderId){
            throw new Error('error on request sending')
           }
        io.to(socketIdMap.get(data.reciever)||'').emit('new_connect',{
            data:await partnerService.createRequeset(senderId),
            note:'you have a request'
        })
        } catch (error:any) {
            io.to(socket.id).emit('errorFromSocket',{message:error.message||'error on user registration'})
            console.log(error)
        }
        
    })
    socket.on('userLoggedOut',async(data:{id:string})=>{
        try {
            const id=jwtService.decodeAccessToken(data.id)
            
            if(!id||typeof id!=='string'){
               throw new Error('id not found')
            }
            await authService.userLoggedOut(id)
            socketIdMap.delete(id)
            socket.broadcast.emit('user_loggedOut',{id:id}) 
        } catch (error:any) {
            io.to(socket.id).emit('errorFromSocket',{message:error.message||'error on user registration'})
            console.log(error)
        }
    
     
    })
    socket.on('userRequestSocket',async(data:{partnerId:string,from:'accept'|'reject',token:string})=>{
      
        try {
            const requesterSocket=socketIdMap.get(data.partnerId)
            const accptor=jwtService.decodeAccessToken(data.token)
            if(!accptor){
                throw new Error('id not foudn')
            }
            const getName=await userProfileService.fetchName(accptor)
            io.to(requesterSocket||'').emit('requestStutus',{
                name:getName,
                from:data.from
            })
        } catch (error:any) {
            io.to(socket.id).emit('errorFromSocket',{message:error.message||'error on user registration'})
            throw new Error(error.error||'erro on socket')
        }
    })
    socket.on('sendMessage',async(data:{
        recieverId:string,
        text: string,
        createdAt: Date, 
        _id: string
        chatId:string    
      })=>{
       try {
        await  messageService.updateReadedMessage(data.chatId)
        const senderId=socketIdMap.get(data.recieverId)
        if(senderId){

            io.to(senderId||'').emit('recieveMessage',data)
            io.to(senderId||'').emit('addMessageCount',{
                id:data._id
            })
        }else{
            throw new Error('user is not online')
        }
       } catch (error:any) {
        io.to(socket.id).emit('errorFromSocket',{message:error.message||'error on user registration'})
        console.log(error)
       }
        
    })
    socket.on('userJoined',(data)=>{
        try {
            if(socketIdMap.has(data.reciverId)){
                const senderId=jwtService.decodeAccessToken(data.senderId)
                if(socketIdMap.has(senderId)){
                    io.to(socketIdMap.get(senderId||'')||'').emit('userIsOnline',{onlineStatus:true})
                    io.to(socketIdMap.get(data.reciverId)||'').emit('userIsOnline',{onlineStatus:true})
                }
              
            }  
        } catch (error:any) {

            io.to(socket.id).emit('errorFromSocket',{message:error.message||'error on user registration'})
            console.log(error)
        }
        
    })
}