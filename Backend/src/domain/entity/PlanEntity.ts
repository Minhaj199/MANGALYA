import {ObjectId} from 'mongoose'
export interface SubscriptionPlan{
name:string
duration:number
features:string[]
amount:string
connection:string
}

export interface SubscriptionPlanDocument extends SubscriptionPlan{

    _id:ObjectId
    delete:boolean
}