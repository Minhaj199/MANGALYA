import { ReportUser } from "../../Infrastructure/repositories/mongoRepositories"
export async function toggleReportRead(id:string,status:boolean){
    const report=new ReportUser()
    try {
        const response=await report.update(id,'read',status)       
        return response
    } catch (error:any) {
        throw new Error(error.message)
    }
}