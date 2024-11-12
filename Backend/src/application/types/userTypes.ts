import { ObjectId } from "mongoose"


export type fetchDateForUserSelection={
    id:ObjectId,
    name:string,
    secondName:string,
    state:string,
    gender:string,
    dateOfBirth:Date
}[]
export type profileTypeFetch = {name:string,
    lookingFor:string,secondName:string,
    state:string,gender:string,
    dateOfBirth:Date,interest:string[],
    photo:string,
    _id?:string
}[]
export type userForLanding={
    name:string
    age:number
    image:string
}
