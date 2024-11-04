import mongoose, { Schema,Document } from "mongoose";
import { SubscriptionPlan } from "../../domain/entity/PlanEntity";
export interface subscriptionPlanModel extends SubscriptionPlan,Document{
    delete:boolean
}

const planSchema=new Schema<subscriptionPlanModel>({
    name:{type:String,unique:true},
    duration:Number,
    features:[String],
    amount:Number,
    connect:Number,
    delete:{type:Boolean,default:false}
})

export const planModel=mongoose.model<subscriptionPlanModel>('Plan',planSchema)