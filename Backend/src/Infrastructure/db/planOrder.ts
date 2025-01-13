import mongoose, { Schema,Document,Types } from "mongoose";
import { PlanOrder, PlanOrderMongo } from "../../types/TypesAndInterfaces";



const PlanOrderSchema=new Schema<PlanOrderMongo>({
    userID:Types.ObjectId,
    amount:Number,
    connect:Number,
    avialbleConnect:Number,
    duration:Number,
    features:[String],
    name:String, 
    Expiry:Date,
    created:{type:Date,default:new Date()}
   
})

export const planOrderModel=mongoose.model<PlanOrderMongo>('Plan_Order',PlanOrderSchema)