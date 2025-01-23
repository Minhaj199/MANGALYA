import { PurchasedPlanInterface } from "../../domain/interface/otherRepositories";
import { PlanOrderMongo } from "../../types/TypesAndInterfaces";
import { planOrderModel } from "../db/planOrder";
import BaseRepository from "./baseRepository";

export class PurchasedPlan extends BaseRepository<PlanOrderMongo> implements PurchasedPlanInterface {
  constructor(){
    super(planOrderModel)
  }
  async fetchRevenue():Promise<number>{
    try {
      const revenue:{totalAmount:number}[]|[]=await planOrderModel.aggregate([
        {
          $group: {
            _id: null, 
            totalAmount: { $sum: "$amount" } 
          }
        }
      ])
      if(revenue[0]?.totalAmount){
        return revenue[0]?.totalAmount
      }else{
        return 0
      }

    } catch (error:any) {
      throw new Error(error.message)
    }
  }

}