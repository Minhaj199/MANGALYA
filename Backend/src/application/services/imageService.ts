import { Cloudinary } from '../../interface/Utility/cloudinary'; 
import { ImageServiceInterface } from '../../types/TypesAndInterfaces';


export class ImageService implements ImageServiceInterface{
    private imageService:Cloudinary
    constructor(imageService:Cloudinary){
        this.imageService=imageService
    }
     upload(path:string){
       return this.imageService.upload(path)
    }
}



