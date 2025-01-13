import express from 'express'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes, { messageService, partnerServiece, userProfileService } from './interface/routes/userRoutes'
import adminRoutes from './interface/routes/adminRoute'
import cors from 'cors'
import {createServer} from 'http'
import { Server } from 'socket.io'
import { socketMethod } from './socket'
import { JWTAdapter } from './Infrastructure/jwt'
import { FixedDataService } from './application/services/fixedDataService'
import { InterestRepo } from './Infrastructure/repositories/otherRepo' 
import { FeaturesRepository } from './Infrastructure/repositories/otherRepo'
const app=express()
const server=createServer(app)
export const io=new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET','POST','PUT','DELETE','PATCH']
    }
})
const corsOpetion={
    origin:['http://localhost:5173'],
    methods:['GET','POST','PUT','DELETE','PATCH']
}



dotenv.config();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion))


app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

const mongo_string:string|undefined=process.env.CONNECTIN_STRING

try {
    mongoose.connect((typeof mongo_string==='string')?mongo_string:' ').then(()=>console.log('db connected'))
    
} catch (error) {
    console.log(error)    
}

// Real-time Socket.IO Integration

export const socketIdMap=new Map<string,string>()


const jwtService=new JWTAdapter()
io.on('connection',(socket)=>socketMethod(socket,partnerServiece,userProfileService,messageService,jwtService))


const PORT:number=parseInt(process.env.PORT||'3000');
server.listen(PORT,()=>console.log(`server is running now ${PORT}`))

const otherService=new FixedDataService(new InterestRepo,new FeaturesRepository)

async function createInterest(){
  await otherService.creatInterest()
  await otherService.createFeatures()
}

createInterest()