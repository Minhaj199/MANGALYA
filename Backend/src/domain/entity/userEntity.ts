import {Types} from 'mongoose'
import { PlanOrder } from '../../Infrastructure/db/planOrder'
// export  interface User{
//     firstName:string,
//     secondName:string
//     email:string,
//     password:string,
//     block:boolean,
//     match:number,
//     subscriber:string
//     expiry:Date
// }
export  interface User{
    PersonalInfo:{
        firstName:string,
        secondName:string,
        state:string,
        gender:string,
        dateOfBirth:Date
        image?:string
        interest?:string[]
    }
    partnerData:{
        gender:string
    }
    email:string,
    password:string
    block:boolean
    CurrentPlan?:PlanOrder
    PlanData?:string[]
    match:string[],
    subscriber:string
    CreatedAt:Date
}

export interface UserWithID extends User{
    _id:Types.ObjectId
}