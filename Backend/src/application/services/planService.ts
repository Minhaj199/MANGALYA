import { SubscriptionPlan } from "../../domain/entity/PlanEntity";
import { PlanRepository } from "../../Infrastructure/repositories/planRepositories"; 
import { PlanServiceInterface } from "../../types/serviceLayerInterfaces";
import { SubscriptionPlanDocument } from "../../types/TypesAndInterfaces";


export class PlanService implements PlanServiceInterface{
    private planRepo:PlanRepository
    constructor(planRepo:PlanRepository){
        this.planRepo=planRepo
    }
    async fetchAll(){
        return this.planRepo.getAllPlans()
    }
    async createPlan(plan:SubscriptionPlan):Promise<SubscriptionPlanDocument|null>{
        try {
        
            const response= await this.planRepo.create(plan)
            return response
        } catch (error:any) {
            console.log(error)
            throw new Error(error)

        }
    }
    async editPlan(data: SubscriptionPlanDocument): Promise<boolean>{
        try {
            return await this.planRepo.editPlan(data)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async softDelete(id:string){
        try {
            if(typeof id!=='string'){
                throw new Error('erron on id getting')
            }
         return   await this.planRepo.softDlt(id)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    
}