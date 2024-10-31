import express from 'express'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './interface/routes/userRoutes'
import adminRoutes from './interface/routes/adminRoute'
import cors from 'cors'
import fileUpload from 'express-fileupload'


const app=express()
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

const PORT:number=parseInt(process.env.PORT||'3000');
app.listen(PORT,()=>console.log(`server is running now ${PORT}`))