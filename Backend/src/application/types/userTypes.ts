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
export type MatchedProfile={
    _id:string 
    state:string
    photo:string|undefined,
    dateOfBirth:Date
    firstName:string
    lastName:string
}
