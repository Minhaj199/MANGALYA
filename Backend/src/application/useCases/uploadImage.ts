import { Cloudinary } from "../../interface/Utility/cloudinary"
import { MongoUserRepsitories } from "../../Infrastructure/repositories/mongoRepositories"
import { Types } from "mongoose"

const cloudinary=new Cloudinary()
const userRepo=new MongoUserRepsitories()

export async function uploadImage(file:any,id:unknown){
    
    try {
        if(typeof id!=='string'){
            throw new Error('id not found')
        }    
        
        const email:any=await userRepo.findEmailByID(id)
        console.log(email)
        if(!email){
            throw new Error('error on image upload')
        }
            const image=file.path||''
                    
                   const url=await cloudinary.upload(image)||''
               
                 const urlInserted=await userRepo.addPhoto(url,email?.email)
                
                if(urlInserted){
                    return true
                }else{
                    throw new Error('error')
                }
        
    } catch (error:any) {
         throw new Error(error.message||'error on photo upload')
    }
}