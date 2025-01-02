import express from 'express'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './interface/routes/userRoutes'
import adminRoutes from './interface/routes/adminRoute'
import cors from 'cors'
import { seedInterestData } from './application/InterestSeed'
import { featureSeed } from './application/featureSeed'
import {createServer} from 'http'
import { Server } from 'socket.io'
import { decodeJwt } from './interface/Utility/exractIdFromJwt'
import { getUserRequest } from './application/useCases/getUserRequests'
import { decode } from 'punycode'

const app=express()
const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:['http://localhost:5173']
    }
})
const corsOpetion={
    origin:['http://localhost:5173']
}



dotenv.config();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion))
// app.use(fileUpload())

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

const mongo_string:string|undefined=process.env.CONNECTIN_STRING

try {
    mongoose.connect((typeof mongo_string==='string')?mongo_string:' ').then(()=>console.log('db connected'))
    
} catch (error) {
    console.log(error)    
}

// Real-time Socket.IO Integration

const socketIdMap=new Map<string,string>()


io.on('connection',(socket)=>{

    socket.on('register_user',(data:{userId:string})=>{
     
        
        try {
            if(data.userId){
                const userId=decodeJwt(data.userId)
                socketIdMap.set(userId,socket.id)
               
        }
       
      } catch (error) {
        
      }  
    })
    socket.on('request_send',async(data:{sender:string,reciever:string})=>{
        try {
           
            const senderId=decodeJwt(data.sender)
       
        io.to(socketIdMap.get(data.reciever)||'').emit('new_connect',{
            
            data:await getUserRequest(senderId),
            note:'you have a request'
        })
        } catch (error) {
            console.log(error)
        }
        
    })
    socket.on('userLoggedOut',(data:{id:string})=>{
     const id=decodeJwt(data.id)
     socketIdMap.delete(id)
    })
    socket.on('userRequestSocket',async(data:{partnerId:string,from:'accept'|'reject',name:string})=>{
      
        const requesterSocket=socketIdMap.get(data.partnerId)
        try {
            io.to(requesterSocket||'').emit('requestStutus',{
                name:data.name,
                from:data.from
            })
        } catch (error) {
            
        }
    })
    socket.on('sendMessage',(data)=>{
        const senderId=socketIdMap.get(data.recieverId)
 
        io.to(senderId||'').emit('recieveMessage',data)
    })
    socket.on('userJoined',(data)=>{
        if(socketIdMap.has(data.reciverId)){
            
           
            const senderId=decodeJwt(data.senderId)
            if(socketIdMap.has(senderId)){

                io.to(socketIdMap.get(senderId||'')||'').emit('userIsOnline',{onlineStatus:true})
                io.to(socketIdMap.get(data.reciverId)||'').emit('userIsOnline',{onlineStatus:true})
                
                console.log(socketIdMap.get(senderId))
            }
          
        }
    })
    socket.on('disconnect', () => {
       
    });
    
})


const PORT:number=parseInt(process.env.PORT||'3000');
server.listen(PORT,()=>console.log(`server is running now ${PORT}`))

async function createInterest(){
  await seedInterestData()
  await featureSeed()
}

createInterest()