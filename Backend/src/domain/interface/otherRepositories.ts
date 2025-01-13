import { Features } from "../../Infrastructure/db/featureModel"
import { InterestInterface, PlanOrderMongo } from "../../types/TypesAndInterfaces"

export interface BaseRepositoryInterface{
    create(data: Partial<unknown>): Promise<unknown>
}
export interface PurchasedPlanInterface{
    create(data:PlanOrderMongo):Promise<PlanOrderMongo>
}
export interface OtherRepositoriesInterface{
    create(data:InterestInterface):Promise<InterestInterface>
    getInterest(): Promise<string[]>
    getInterestAsCategory():Promise<InterestInterface|null>
}
export interface FeaturesRepositoryInterface{
    create(data:Features):Promise<Features>
    isExits():Promise<boolean>
}