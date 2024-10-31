

import mongoose,{Schema,Document,ObjectId} from "mongoose";
import {User} from "../../domain/entity/userEntity";
export interface IUserModel extends User,Document{}

const userSchema=new Schema<IUserModel>({
    PersonalInfo:{
        firstName:String,
        secondName:String,
        state:String,
        gender:String,
        dateOfBirth:Date,
        image:String,
        interest:[String]
    },
    partnerData:{
        gender:String
    },
    email:{type:String,unique:true},
    password:String,
    block:Boolean,
    match:[{type:Schema.Types.ObjectId,ref:'User'}],
    subscriber:String,
    expiry:Date

})
export const UserModel=mongoose.model<IUserModel>('User',userSchema)