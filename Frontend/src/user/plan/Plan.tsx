import React, { useEffect, useState } from "react";
import "./Plan.css";
import { request } from "../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
export type PlanData={
  name:string
  connect:number
  duration:number
  features:string[]
  amount:number
  _id:string
}
const PlanPurchase = () => {
  const navigate=useNavigate()
  const [planData,setPlanData]=useState<PlanData[]>([{_id:'',amount:0,duration:0,features:[''],connect:0,name:''}])
  useEffect(()=>{
   async function fetchPlanData(){
    const response:typeof planData=await request({url:'/user/fetchPlanData'})
    console.log(response)
    setPlanData(response)
   }
   fetchPlanData()
   
  },[])
  function handleSkip(){
    localStorage.clear()
    navigate('/')
  }
 async function handlePurchase(planInfo:PlanData){
    if(localStorage.getItem('id')){
      try {
        const response=await request({url:'/user/purchasePlan',method:'post',data:{id:localStorage.getItem('id'),planData:planInfo}})
        console.log(response)
      } catch (error) {
        
      }
    }
  }
  return (
    <div id="Plan" className="h-svh w-screen flex items-center flex-col ">
      <h1 className="text-white text-5xl mt-10 font-italian">
        PLEASE JOIN OUR FAMILY
      </h1>
      <p className="text-white">
        Please take an attractive plan for you and enhance your Profile
      </p>
      <div className="w-screen h-14  flex justify-end items-center px-2">
        <p className="text-white cursor-pointer" onClick={handleSkip}>{"DO IT LATER>"}</p>
      </div>
      <div className="w-screen px-4 overflow-x-auto  h-[70%] flex justify-center items-center">
       {planData.map((el,index)=>{
        return(

        <div key={index} className="w-[300px] h-[95%] ml-5 rounded-2xl bg-[rgba(0,0,0,0.8)]">
          <div className="w-full h-[13%]  flex justify-center items-center">
            <p className="text-white font-bold font-inter">{`${el.name} : ${el.duration} month`} </p>
          </div>
          <div className="w-full h-[18%]  flex justify-center items-center flex-col">
            <p className="text-white text-2xl font-bold ">{`₹ ${el.amount}`}</p>
            <p className=" text-white">{`${(el.amount/el.duration).toFixed(0)}/month`}</p>
          </div>
          <div className="w-[80%] h-[50%] ml-10  flex py-10  flex-col ">
            {el.features.map((elem,index)=>{
              return(
                
            <p key={index} className="inline-flex mb-2  text-white items-center">
              <img src="./check-mark.png" className="w-8 h-8" alt="" />{ `${elem}`}
            </p>
              )
            })}
          </div>
          <div className="w-full h-20 flex justify-center items-center ">
            <button onClick={()=>handlePurchase(el)} className="border border-dark_red px-10 py-1 rounded-xl text-white">
              BUY
            </button>
          </div>
        </div>
        )
       })}


        
      </div>
    </div>
  );
};

export default PlanPurchase;
