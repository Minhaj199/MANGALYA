import express from 'express'
import { createWriteStream } from 'fs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes, { authService, messageService, partnerServiece, userProfileService } from './interface/routes/userRoutes'
import adminRoutes from './interface/routes/adminRoute'
import cors from 'cors'
import morgan from 'morgan'
import {createServer} from 'http'
import { Server } from 'socket.io'
import { socketMethod } from './socket'
import { JWTAdapter } from './Infrastructure/jwt'
import { FixedDataService } from './application/services/InterestAndFeatures'
import { InterestRepo, TokenRepository } from './Infrastructure/repositories/otherRepo' 
import { FeaturesRepository } from './Infrastructure/repositories/otherRepo'
import {join} from 'path'
import cookieParser from 'cookie-parser'
const app=express()
const server=createServer(app)
export const io=new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET','POST','PUT','DELETE','PATCH'],
        exposedHeaders: ['authorizationforuser'],
       
    }
})
const corsOpetion={
    origin:['http://localhost:5173'],
    methods:['GET','POST','PUT','DELETE','PATCH'],
    exposedHeaders: ['authorizationforuser'],
}



dotenv.config();
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
    app.use(cors(corsOpetion))


///////logger////////////
const accessLogStream=createWriteStream(join(__dirname, '/logger/morganLogs.log'),{ flags: 'a' })

app.use(morgan('tiny'))
app.use(morgan('combined',{stream:accessLogStream }))


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

const jwtService=new JWTAdapter(new TokenRepository)
io.on('connection',(socket)=>socketMethod(socket,partnerServiece,userProfileService,messageService,jwtService,authService))


const PORT:number=parseInt(process.env.PORT||'3000');
server.listen(PORT,()=>console.log(`server is running now ${PORT}`))

const otherService=new FixedDataService(new InterestRepo,new FeaturesRepository)

async function createInterest(){
  await otherService.creatInterest()
  await otherService.createFeatures()
}

createInterest()