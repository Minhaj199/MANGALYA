import { PurchasedPlanInterface } from "../../domain/interface/otherRepositories";
import { PlanOrderMongo } from "../../types/TypesAndInterfaces";
import { planOrderModel } from "../db/planOrder";
import BaseRepository from "./baseRepository";

export class PurchasedPlan extends BaseRepository<PlanOrderMongo> implements PurchasedPlanInterface {
  constructor(){
    super(planOrderModel)
  }

}