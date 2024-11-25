import { Dispatch,SetStateAction } from "react";
import { PlanData, planMgtWarningType } from "../admin/pages/AddPlan/AddPlan";
import { alertWithOk } from "../utils/alert/sweeAlert";
import { PlanType } from "../admin/pages/PlanMa/PlanMgt";

export type PlanDataForValidation={
    name:string;
    amount:number|string;
    connect:number|string;
    duration:number
}
export function PlanValidator(planData:PlanData|PlanType,setWarning:Dispatch<SetStateAction<planMgtWarningType>>,handleFeatureState:string[]):boolean{
   let state=true
   console.log(planData.duration)
    const planDatas=planData as PlanDataForValidation
    if(planData.name.trim()===''){
        setWarning(el=>({...el,name:'Blank not allowed'}))
        state= false
    }else if(planData.name.length>10||planData.name.length<3){
        setWarning(el=>({...el,name:'Name should b/w 3-10'}))   
        state= false
    }
    else{
        setWarning(el=>({...el,name:''}))
    }
    if(NaN||planDatas.amount===''||typeof planData.amount==='number'&&planData.amount===0){
        
        setWarning(el=>({...el,amount:'insert Amt'}))
        state= false
    }
    else if(typeof planDatas.amount==='number'&&planDatas.amount>=10000){
        setWarning(el=>({...el,amount:'!more than 10000'}))   
        state= false
    }
    else{
        setWarning(el=>({...el,amount:''}))
    }
    if(planData.connect<=0||''){
        setWarning(el=>({...el,connect:'!insert number'}))
        state= false
    }else if(planData.connect>1000){
        setWarning(el=>({...el,connect:'!more than 1000'}))   
        state= false
    }
    else{
        setWarning(el=>({...el,connect:''}))
    }
    if(planData.duration===0){
        setWarning(el=>({...el,duration:'!Blank'}))
        state=false
    }else{
        setWarning(el=>({...el,duration:''}))
    }
    if(!handleFeatureState.length){
        alertWithOk('Features','Please insert featurs',"info")
        state=false 
    }
    return  state
}