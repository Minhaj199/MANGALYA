import { userData } from "@/user/userProfile/userProfile";
import { Dispatch, SetStateAction } from "react";
import { getDateFromAge } from "./getDateFromAge";
import { getInputDate } from "./getDateToDateInput";
export type fetchBlankData = {
    PersonalInfo: {
      firstName: string;
      secondName: string;
      state: string;
      gender: string;
      dateOfBirth: Date;
      interest: string[];
      age: number;
      image: string;
    };
    PartnerData: { gender: string };
    Email: string;
    subscriptionStatus: string;
    currentPlan: {
      amount: number;
      connect: number;
      avialbleConnect: number;
      duration: number;
      features: string[];
      name: string;
      Expiry: Date;
    };
  };
  interface FindChange{
    dataToFind:userData
    orginalData:fetchBlankData
    
  }

export function findChange({dataToFind,orginalData}:FindChange){
  
    
    if(dataToFind.PersonalInfo.firstName===orginalData.PersonalInfo.firstName){
        dataToFind.PersonalInfo.firstName=''
      
        
    }
    if(dataToFind.PersonalInfo.secondName===orginalData.PersonalInfo.secondName){
        
        dataToFind.PersonalInfo.secondName=''
       
    }
    if(dataToFind.PersonalInfo.gender===orginalData.PersonalInfo.gender){
        dataToFind.PersonalInfo.gender=''
     
        
    }
    if(dataToFind.PersonalInfo.state===orginalData.PersonalInfo.state){
        dataToFind.PersonalInfo.state=''
       
        
    }
    if(dataToFind.PersonalInfo.interest?.length===orginalData.PersonalInfo.interest?.length){
        
            if(dataToFind.PersonalInfo.interest?.length&&dataToFind.PersonalInfo.interest?.length){

                const sortedArr1 = [...dataToFind.PersonalInfo.interest]?.sort();
                const sortedArr2 = [...dataToFind.PersonalInfo.interest]?.sort();
                if( sortedArr1?.every((value, index) => value === sortedArr2[index])){
                    
                    dataToFind.PersonalInfo.interest=null
                   
                }
            }
                
           
            
        }
        
        if(getInputDate('intoInput',new Date (dataToFind.PersonalInfo.dateOfBirth).toDateString())===getInputDate ('intoInput',new Date(orginalData.PersonalInfo.dateOfBirth).toDateString())){
            dataToFind.PersonalInfo.dateOfBirth=''

            
        }
        if(dataToFind.partnerData.gender===orginalData.PartnerData.gender){
            dataToFind.partnerData.gender=''
           
            
        }
        if(dataToFind.email===orginalData.Email){
           dataToFind.email=''
           
            
        }
        console.log(dataToFind)
       return dataToFind
        

}