import { FeaturesRepositoryInterface, OtherRepositoriesInterface } from "../../domain/interface/otherRepositories";
import { InterestInterface } from "../../types/TypesAndInterfaces";
import { featureModel, Features } from "../db/featureModel";
import { InterestModel } from "../db/signupInterest";
import BaseRepository from "./baseRepository";

export class InterestRepo extends BaseRepository<InterestInterface> implements OtherRepositoriesInterface{
  constructor(){
    super(InterestModel)
  }
  async getInterest(){
    
   return await this.model.aggregate([
      {
          $project: {
            arrayFields: {
              $filter: {
                input: { $objectToArray: "$$ROOT" }, 
                as: "field",
                cond: { $isArray: "$$field.v" }, 
              },
            },
          },
        },
        {
          $project: {
            allInterests: {
              $reduce: {
                input: "$arrayFields",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this.v"] }, 
              },
            },
          },
        },
    ]);
  }
  async getInterestAsCategory(){
    try {
      return await this.model.findOne({},{_id:0,sports:1,music:1,food:1})
    } catch (error:any) {
      throw new Error(error.message)
    }
  }
  async isExist(){
    const exitstingData=await InterestModel.findOne()
    return exitstingData
  }
}
export class FeaturesRepository extends BaseRepository<Features> implements FeaturesRepositoryInterface{
    constructor(){
      super(featureModel)
    }
    async isExits(){
      try {
        const isExist:{features:string[]}|null=await this.model.findOne()
        if(isExist){
          return true
        }else{
          return false
        }
        
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
  }