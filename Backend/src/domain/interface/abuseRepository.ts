import { AbuserMongoDoc } from "../../types/TypesAndInterfaces"
import { AbuserReport } from "../entity/abuse"




export interface AbuserRepositoryInterface{
    findComplain(id:string,reason:string,profileId:string):Promise<AbuserMongoDoc|null>
    getMessages():Promise<AbuserReport[]|[]>
    create(data:AbuserReport):Promise<AbuserMongoDoc>,
    update(id:string,field:string,change:string|boolean):Promise<boolean>
    delete(id:string):Promise<boolean>
}