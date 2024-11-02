import { SubscriptionPlan,SubscriptionPlanDocument } from "../entity/PlanEntity";

export interface SubscriptionPlanRepo{
    create(plan:SubscriptionPlan):Promise<boolean>
}