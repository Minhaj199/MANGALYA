

import mongoose,{Schema,Document} from "mongoose";
import {User} from "../../domain/entity/userEntity";
export interface IUserModel extends User,Document{}

const userSchema=new Schema<IUserModel>({
    username:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    block:{type:Boolean,default:false},
    match:{type:Number,default:5},
    subscriber:{type:String},
    expiry:{type:Date}

})
export const UserModel=mongoose.model<IUserModel>('User',userSchema)