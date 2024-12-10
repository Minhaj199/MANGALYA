import mongoose, { Schema,Document,Types } from "mongoose";

export interface PlanOrder{
    userID:Types.ObjectId,
    name:string,
    duration:number
    features:string[]
    amount:string
    connect:number
    avialbleConnect:number
    Expiry:Date
    created?:Date
}

const PlanOrderSchema=new Schema<PlanOrder>({
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

export const planOrderModel=mongoose.model<PlanOrder>('Plan_Order',PlanOrderSchema)