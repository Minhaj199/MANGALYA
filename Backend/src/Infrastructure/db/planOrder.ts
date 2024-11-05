import mongoose, { Schema,Document,Types } from "mongoose";

export interface PlanOrder{
    userID:Types.ObjectId,
    nameOfPlan:string,
    duration:number
    features:string[]
    amount:string
    connect:string
    created?:Date
  
}

const PlanOrderSchema=new Schema<PlanOrder>({
    userID:Types.ObjectId,
    amount:Number,
    connect:Number,
    duration:Number,
    features:[String],
    nameOfPlan:String,
    created:{type:Date,default:new Date()}
   
})

export const planOrderModel=mongoose.model<PlanOrder>('PlanOrder',PlanOrderSchema)