import { AbuserReport } from "../entity/abuse"




export interface Abuser{
    getMessages():Promise<AbuserReport[]|[]>
    create(data:AbuserReport):Promise<boolean>,
    markAsReaded(reportedId:string):Promise<boolean>
    update(id:string,field:string,change:string|boolean):Promise<boolean>
    delete(id:string):Promise<boolean>
}