import { ObjectId } from "mongoose"


export type fetchDateForUserSelection={
    id:ObjectId,
    name:string,
    secondName:string,
    state:string,
    gender:string,
    dateOfBirth:Date
}[]