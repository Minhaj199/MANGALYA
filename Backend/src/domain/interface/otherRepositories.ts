
import { Features } from "../../Infrastructure/db/featureModel"
import { InterestInterface, PlanOrderMongo, RefeshToken, RefreshWithPopulatedData } from "../../types/TypesAndInterfaces"

export interface BaseRepositoryInterface{
    create(data: Partial<unknown>): Promise<unknown>
}
export interface PurchasedPlanInterface{
    create(data:PlanOrderMongo):Promise<PlanOrderMongo>
    fetchRevenue(): Promise<number>
}
export interface OtherRepositoriesInterface{
    create(data:InterestInterface):Promise<InterestInterface>
    getInterest(): Promise<string[]>
    getInterestAsCategory():Promise<InterestInterface|null>
   
}
export interface FeaturesRepositoryInterface{
    create(data:Features):Promise<Features>
    isExits():Promise<boolean>
    fetchFeature():Promise<{ features: Features}|null>
}
export interface RefreshTokenInterface{
    create(data:RefeshToken):Promise<RefeshToken>
    fetchToken(extractId:string,refreshToken:string): Promise<RefreshWithPopulatedData|null>
    deleteToken(id: string): Promise<void>
}