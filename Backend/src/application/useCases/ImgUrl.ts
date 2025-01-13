import { Cloudinary } from "../../interface/Utility/cloudinary" 


export async function ImgUrl(file:any){
    try {
        const cloud=new Cloudinary()
        const image=file.path||''
        const url=await cloud.upload(image)||''
        console.log(url)
        return url        
    } catch (error) {
        console.log(error)
    }

}