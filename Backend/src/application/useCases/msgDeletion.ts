import { ReportUser } from "../../Infrastructure/repositories/reportUser" 
export async function msgDeletion(id:string){
    const reportRepo=new ReportUser()
    try {
        const response=await reportRepo.delete(id)
        return response
    } catch (error:any) {
        throw new Error(error.message||'error on deletion')
    }
    
}