import {Types} from 'mongoose'
export  interface User{
    username:string,
    email:string,
    password:string,
    block:boolean,
    match:number,
    subscriber:string
    expiry:Date
}

export interface UserWithID extends User{
    _id:Types.ObjectId
}