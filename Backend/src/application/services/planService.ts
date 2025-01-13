import { PlanRepository } from "../../Infrastructure/repositories/planRepositories"; 
import { PlanServiceInterface } from "../../types/serviceLayerInterfaces";


export class PlanService implements PlanServiceInterface{
    private planRepo:PlanRepository
    constructor(planRepo:PlanRepository){
        this.planRepo=planRepo
    }
    async fetchAll(){
        return this.planRepo.getAllPlans()
    }
}