

import mongoose,{Schema,Document} from "mongoose";
import {User} from "../../domain/entity/userEntity";
export interface IUserModel extends User,Document{}

const userSchema=new Schema<IUserModel>({
    PesonalInfo:{
        firstName:String,
        secondName:String,
        state:String,
        gender:String,
        dateOfBirth:Date
    },
    parnerData:{
        gender:String
    },
    email:{type:String,unique:true},
    password:String,
    block:Boolean,
    match:Number,
    subscriber:String,
    expiry:Date

})
export const UserModel=mongoose.model<IUserModel>('User',userSchema)