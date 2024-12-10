import   cloudinary  from 'cloudinary';

import fs from 'fs'
cloudinary.v2.config({
    cloud_name: 'dyomgcbln',
    api_key: '532727725169433',
    api_secret: 'Bt-UE-vnsI8V5eKvnV_0SFgPhDg'
  });



export class Cloudinary{
   async upload (path:string){ 
    try {
        const result=await cloudinary.v2.uploader.upload(path,{
            folder:'mangalya'
        })
        console.log(result)
        fs.unlink(path,()=>{})
        if(result.secure_url){
            return result.secure_url
        }
    } catch (error:any) {
        console.log(error)
        throw new Error(error.message||'error on cloudinary')
    }
        
    }
}



