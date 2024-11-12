import mongoose, { Schema,Document } from "mongoose";

interface Interest extends Document{
   sports:string[];
   music:string[]
   food:string[]
}

const interestSchem=new Schema <Interest>({
    sports:{type:[String],required:true},
    music:{type:[String],required:true},
    food:{type:[String],required:true},
})

export const InterestModel=mongoose.model<Interest>('Interests',interestSchem)