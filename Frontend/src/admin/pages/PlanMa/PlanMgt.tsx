import React, { useEffect, useState } from "react";
import "./plan.css";
import { request } from "../../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import {  alertWithOk, handleAlert, promptSweet } from "../../../utils/alert/sweeAlert";

import { planMgtWarningType } from "../AddPlan/AddPlan";
import { PlanValidator } from "../../../Validators/planValidator";

export type PlanType={
  _id:string,
  name:string,
  delete:boolean
  duration:number
  features:string[]
  amount:number
  connect:number
}

export const PlanDetails = () => {
  const [warning,setWarning]=useState<planMgtWarningType>({amount:'',connect:'',duration:'',name:''})
  const navigate=useNavigate()
  const [editData,setEditData]=useState<PlanType>({_id:'',amount:0,connect:0,delete:true,duration:0,features:[''],name:'NO PLANS'})
  const months = Array.from({ length: 36 }, (_, index) => index + 1);
  const [toggle,setToggle]=useState<boolean>(true)
  const [datas,setData]=useState<PlanType[]>([{_id:'',amount:0,connect:0,delete:true,duration:0,features:[''],name:'NO PLANS'}])  
  const [currentData,setCurrentData]=useState<PlanType>()
  


  let dataDB:PlanType[];
  useEffect(()=>{
    async function fetchPlanData(){
      dataDB=await request({url:'/admin/fetchPlanData'})
      setData(dataDB)
    }
    fetchPlanData()
  },[])
  useEffect(()=>{
    if(datas){
      setCurrentData(datas[0])
    }  
  },[datas])
  useEffect(()=>{
    if(!toggle&&currentData){
      setEditData(currentData)
    }else if(toggle){
      setEditData({_id:'',amount:0,connect:0,delete:false,duration:0,features:[''],name:''})
    }
  },[toggle])
  function handleInserData(el:string){
    if(datas){
     const singleData=datas.filter(elem=>elem._id===el)
      if(singleData.length&&singleData){
        setCurrentData(singleData[0])
      }
    }else{
     
    }
  }
  async function handleRemovePlan(id:string,name:string){
    await promptSweet(deletePlan,`Do you want to remove ${name} plan ?`,`plan ${name} removed`,)
    async function deletePlan(){

      try {
        
        const response:{response:boolean,message:string}=await request({url:'/admin/removePlan',method:'patch',data:{id:id}}) 
        if(response.response){
            setData(el=>el.filter(elem=>elem._id!==id))
            if(currentData?._id===id){
              setCurrentData(datas[0])
            }
            handleAlert("success",'Plan removed')
          }else{
            throw new Error(response.message)
          }
        console.log(response)
      } catch (error:any) {
        alertWithOk('Plan Remove',error.message||'Error occured on deleting',"error")
      }
    }    
  }
  function manageBtwAddEdit(action:'Edit'|'Details',id:unknown){
    
    if(typeof id==='string'){
      if(action==="Edit"){
        
        setToggle(false)
      }
    }else{
    handleAlert("error",'Error occured')  
    }
  }
  function handleClose(el:string){
    setEditData(datas=>{
      
      return {...datas,features:datas.features.filter(element=>element!==el)}
    })
  }
  function changeOnfeature(e:React.ChangeEvent<HTMLSelectElement>){
    
    if(!editData.features.includes(e.target.value)){
      setEditData(el=>({...el,features:[...el.features,e.target.value]}))
    }
  }
 async function handleSubmission(){
        
   if( PlanValidator(editData,setWarning,editData.features)){
    try {
      
      const response:{response:true,message:string} =await request({url:'/admin/editPlan',method:'put',data:editData})
      console.log(response)
      if(response.response){
        setData((el)=>el.map(element=>(element._id===editData._id)?editData:element))
        setCurrentData(editData)
        setEditData({_id:'',amount:0,connect:0,delete:true,duration:0,features:[''],name:'NO PLANS'})
        setToggle(true)
        alertWithOk('Plan Edit','Plan edited successfully',"success")
      }else{
        throw new Error(response.message)
      }
    } catch (error:any) {
      alertWithOk('Plan Edit',error.message||'Error occured on editing',"error")
    } 
    }
  }
  return (
    <div className="w-full h-full bg-slate-300">
      {!toggle&&<div className="w-52 h-10 font-bold flex justify-center items-end">
        <p onClick={()=>setToggle(true)} className=" text-input_dark cursor-pointer">BACK</p>
      </div>}
      
      {toggle&&<div className="w-full h-[25%]  flex justify-center items-center">
    <div className="w-[80%]  h-[95%] border border-dark_red bg-white overflow-y-auto flex">
     {datas?.map((el,index)=>{
      return(
        <div onClick={()=>handleInserData(el._id)} key={index} className="w-44 mx-6 my-2 rounded-lg  h-[90%] bg-black flex flex-col hover:bg-[#1c1b1b] active cursor-pointer">
        <div onClick={()=>handleRemovePlan(el._id,el.name)} className="w-[90%] h-[20%] ml-1   text-end font-bold text-white">
          X
        </div>
        <div className="w-[100%] h-[80%] text-white flex justify-center items-center font-inter font-semibold">
          {el.name}
        </div>
      </div>
      )
     })}
      
      
    </div>
    <div onClick={()=>navigate('/admin/addPlan')}   className="w-[17%] h-[95%] ml-2 bg-white border border-dark_red cursor-pointer  flex justify-center items-center ">
      <p className=" font-bold  text-dark_red  ">ADD</p>
    </div>
  </div>}
  
    <div className={!toggle?"w-full h-[95%]  flex justify-center items-center":"w-full h-[75%]  flex justify-center items-center"}>
        <div className="sm:w-[40%] w-[80%] sm:h-[90%] h-[90%] rounded-3xl border  border-dark_red hover:border-b-2 bg-white px-10 items-center flex flex-col">
          {!toggle&&currentData&&
          <div className=" h-full w-full justify-center flex flex-col items-center">
          <h1 className="font-bold text-2xl text-dark_red mt-2 mb-5">
            EDIT
          </h1>
          <div className="w-[100%] h-[15%]     justify-between mb-2">
            <label
              htmlFor=""
              className="block font-inter font-bold text-dark_red"
            >
              NAME
            </label>

            <input
            id="name"
            value={editData.name}
            onChange={(t)=>setEditData(el=>({...el,name:t.target.value}))}
              type="text"
              className=" w-[90%] border-b border-b-dark_red  outline-none"
            />
          
            {/* <input type="text" className='border border-black focus:border-blue-500 'placeholder='type hear' /> */}
            <p className="mt-1">{warning.name?warning.name:''}</p>
          </div>
          <div className="w-[100%] h-[20%]  mb-2 flex justify-between">
            <div className="w-[33%] h-full ">
              <label className="text-dark_red font-bold">AMOUNT</label>
              <input
              onChange={(t)=>setEditData(el=>({...el,amount:parseInt(t.target.value)||0}))}
                id="amount"
                value={editData.amount}
                
                type="number"
                className="mt-1 w-[60%] outline-none"
                min={1}
                max={10000}
              />
              <p className="mt-1">{warning.amount?warning.amount:''}</p>
            </div>
            <div className="w-[33%] h-full ">
              <label className="text-dark_red font-bold">connect</label>
              <input
              value={editData.connect}
              onChange={(t)=>setEditData(el=>({...el,connect:parseInt(t.target.value)||0}))}
                id="amount"
                type="number"
                className="mt-1 w-[80%] outline-none"
                min={1}
                max={10000}
              />
              <p className="mt-1 ">{warning.connect?warning.connect:''}</p>
            </div>
            <div className="w-[33%] h-full">
              <label className="text-dark_red font-bold">DURATION</label>
              {/* <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} /> */}
              <select
              value={editData.duration}
              onChange={(t)=>setEditData(el=>({...el,duration:parseInt(t.target.value)||0}))}
                className="h-8 outline-none border-b border-dark_red"
                name=""
                id=""
              >
                <option value="">Month</option>
                {months.map((el, index) => (
                  <option key={index} value={el}>
                    {el} month
                  </option>
                ))}
              </select>
              <p className="mt-1">{warning.duration?warning.duration:''}</p>
            </div>
          </div>
          <div className='w-full h-10  mb-2'>
                    <select onChange={(t)=>changeOnfeature(t)}  className='w-[40%] outline-none rounded-xl sm:h-[80%] h-[50%] sm:text-base text-xs bg-dark_red text-white' name="features" id="">
                        <option value="">Features</option>
                        <option value="Video call">VIDEO CALL</option>
                        <option value="Umlimited message">UNLIMITED MESSAGE</option>
                        <option value="Suggestion">SUGGESTION BY US</option>
                        <option value="Priority">GET PRIORIY</option>
                    </select>
                </div>
                <div className='w-[100%] h-[30%] bg-gray-400'>
                {editData.features.map((el,index)=>(
                        <div key={index} className='w-full h-[20%] mt-2 bg-dark_red  flex'>
                       
                        <div className='w-[90%] h-full flex  items-center text-white px-2 '>
                            
                            <p >{index+1}.<span className='pl-2'>{el}</span></p>
                        </div>
                        <div onClick={()=>handleClose(el)}  className='w-[10%] h-full text-center cursor-pointer text-white font-black'>
                            X
                        </div>
                    </div>    
                        ))}
                    
                </div>
          <button onClick={handleSubmission} className="bg-gray-600 mt-2 px-8 py-2 rounded-lg font-medium text-white hover:bg-input_dark">SUBMIT</button>
          </div>
          }
          {toggle&&
          <div className=" h-full w-full justify-center flex flex-col items-center">
          <h1 className="font-bold text-2xl text-dark_red mt-2 mb-5">
            DETAILS
          </h1>
          <div className="w-[100%] h-[11%]  border-b border-dark_red    justify-between mb-10">
          <label className="text-dark_red font-bold">NAME</label>
            <p className="hover:font-medium">{currentData?.name}</p>
            
          </div>
          <div className="w-[100%] h-[20%]  mb-2 flex justify-between">
            <div className="w-[30%] h-14  border-b border-dark_red  ">
              <label className="text-dark_red font-bold">AMOUNT</label>
              
              <p className="mt-1 hover:font-medium ">{currentData?.amount}</p>
            </div>
            <div className="w-[30%] h-14 border-b border-dark_red  ">
              <label className="text-dark_red font-bold">CONNECT</label>
              <p className="mt-1 hover:font-medium ">{currentData?.connect}</p>
            </div>
            <div className="w-[33%] h-14 border-b border-dark_red ">
              <label className="text-dark_red font-bold">DURATION</label>
              {/* <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} /> */}
            
              <p className="mt-1 hover:font-medium">{currentData?.duration}</p>
            </div>
          </div>
          <div className="w-[100%] h-[30%] border  bg-gray-200">
            {currentData?.features&&currentData?.features.map((el,index)=>{
              return(
                <div key={index} className='w-full h-[20%] mt-2 bg-dark_red hover:bg-red-900  flex'>
                       
                <div className='w-[90%] h-full flex  items-center text-white px-2 '>
                    
                    <p >{index+1}.<span className='pl-2'>{el}</span></p>
                </div>
                
                
            </div> 
              )
            })}
         
          </div>
          <button onClick={()=>manageBtwAddEdit('Edit',currentData?._id)} className="border border-dark_red mt-2 py-2 px-8 font-bold rounded-3xl hover:bg-dark_red hover:text-white ">MAKE CHANGES</button>
          </div>
          }
        </div>
      </div>
    </div>
  );
};
