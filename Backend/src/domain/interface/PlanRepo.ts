import { SubscriptionPlan,SubscriptionPlanDocument } from "../entity/PlanEntity";

export interface SubscriptionPlanRepo{
    create(plan:SubscriptionPlan):Promise<boolean>
    getAllPlans():Promise<SubscriptionPlanDocument[]|[]>
    editPlan(data:SubscriptionPlanDocument):Promise<boolean>
    softDlt(id:string):Promise<true>
}