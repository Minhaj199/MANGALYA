
import { Document } from "mongoose";
import { SubscriptionPlan } from "../../domain/entity/PlanEntity";
import { SubscriptionPlanRepo } from "../../domain/interface/PlanRepo";
import { planModel } from "../db/planModel";
import BaseRepository from "./baseRepository";

 interface SubscriptionPlanDocument extends SubscriptionPlan,Document{
    delete:boolean
}
export class PlanRepository extends BaseRepository<SubscriptionPlanDocument> implements SubscriptionPlanRepo  {
constructor(){
    super(planModel)
}

  async getAllPlans(): Promise<SubscriptionPlanDocument[] | []> {
    try {
      const response: SubscriptionPlanDocument[] | [] = await planModel.find({
        delete: false,
      });
     
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async editPlan(data: SubscriptionPlanDocument): Promise<true> {
    try {
      if (typeof data._id === "string") {
        const response = await planModel.updateOne(
          { _id: data._id },
          { $set: data }
        );
        if (response) {
          return true;
        }
      }
      throw new Error("Error on id");
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Name already exist");
      } else {
        throw new Error(error);
      }
    }
  }
  async softDlt(id: string): Promise<true> {
    try {
   
      const response = await planModel.updateOne(
        { _id: id },
        { $set: { delete: true } }
      );
      if (response) {
       
        return true;
      }
      throw new Error("Error on remove plan");
    } catch (error: any) {
      throw new Error(error.message || "error on remove plan");
    }
  }
}