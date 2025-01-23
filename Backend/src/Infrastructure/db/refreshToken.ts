import mongoose,{ Schema } from "mongoose";
import { RefeshToken } from "../../types/TypesAndInterfaces";



const tokenSchema=new Schema<RefeshToken>({
    userId:{type:Schema.ObjectId,ref:'User'},
    token:String
},{timestamps:true})
tokenSchema.index({createdAt:1},{ expireAfterSeconds: 86400000  })
export const refeshTokenModel=mongoose.model<RefeshToken>('refeshTokens',tokenSchema)
