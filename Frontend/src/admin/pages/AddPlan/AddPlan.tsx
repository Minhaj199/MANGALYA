import React, { useState } from 'react'

import './planMgt.css'
import { PlanValidator } from '../../../Validators/planValidator'
import { alertWithOk, handleAlert } from '../../../utils/alert/sweeAlert'
import { request } from '../../../utils/axiosUtils'
import { useNavigate } from 'react-router-dom'
export type planMgtWarningType={

    name:string
    amount:string
    connect:string
    duration:string
}
export type PlanData={
    name:string;
    amount:number;
    connect:number;
    duration:string
}


export const PlanMgt = () => {
    const navigate=useNavigate()
    const [warning,setWarning]=useState<planMgtWarningType>({amount:'',connect:'',duration:'',name:''})
    const [datas,setDatas]=useState<PlanData>({amount:0,connect:0,name:'',duration:''})
    const months=Array.from({length:36},(_,index)=>index+1)
    const [handleFeatureState,setHandleFeature]=useState<string[]>([])
  
    const handleFeature=(t:React.ChangeEvent<HTMLSelectElement>)=>{
        
        if(!handleFeatureState.includes(t.target.value))
        setHandleFeature(el=>[...el,t.target.value])
   
    }
    function handleClose(item:string){
        setHandleFeature(el=>el.filter(el=>el!==item))
    }
   async function handleSubmit(){
        
        if(PlanValidator(datas,setWarning,handleFeatureState)){
            try {
                const response:unknown=await request({url:'/admin/insertPlan',method:'post',data:{datas,handleFeatureState}})
                if(typeof response==='string'&&response==='Name already exist'){
                    throw new Error(response)
                }
                else if(typeof response==='object'){
                    
                    handleAlert('success','Plan Added')
                    navigate('/admin/Plan')
                }
                
            } catch (error:any) {
                
                alertWithOk('Plan insertion',error||'Error occured','error')
            }
        }
        
        
    }
  return (
    <div className='w-full h-full bg-slate-300'>
        <div className='w-full h-14 px-6 py-4 '>
            <p onClick={()=>navigate('/admin/Plan')} className='font-bold text-dark_red cursor-pointer' >{'BACK'}</p>
        </div>
        <div className='w-full h-[90%]  flex justify-center items-center'>
            <div className='sm:w-[40%] w-[80%] sm:h-[95%] h-[90%] rounded-3xl bg-white px-10 items-center flex flex-col'>
                <h1 className='font-bold text-2xl text-dark_red mt-2 mb-5'>ADD PLAN</h1>
                <div className='sm:w-[100%] w-[100%] h-[15%] sm:h-[20%]     justify-between mb-2'>
                    <label htmlFor="" className='block font-inter font-bold text-dark_red'>NAME</label>


                    <input id='name' onChange={(t)=>setDatas(el=>({...el,name:t.target.value}))} type="text" value={datas.name} className=' w-[90%]  text-sm  outline-none' />
                    
                    
                    
                    
                    {/* <input type="text" className='border border-black focus:border-blue-500 'placeholder='type hear' /> */}
                    <p className='mt-1 sm:text-base text-xs'>{warning.name}</p>

                </div>
                <div className='w-[100%] h-[20%]  flex justify-between'>
                    <div className='w-[33%] h-full  '>
                    
                        <label className='text-dark_red font-bold sm:text-base text-xs'>AMOUNT</label>
                        <input id='amount' onChange={(t)=>setDatas(el=>({...el,amount:parseInt( t.target.value)||0}))} value={(datas.amount===0)?'':datas.amount} type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} />
                        <p className='mt-1 sm:text-base text-xs'>{warning.amount}</p>
                    
                    </div>
                    <div className='w-[33%] h-full '>
                    <label className='text-dark_red font-bold sm:text-base text-xs'>CONNECTION</label>
                        <input onChange={(t)=>setDatas(el=>({...el,connect:parseInt( t.target.value)||0}))} value={(datas.connect===0)?'':datas.connect} id='amount' type="number" className='mt-1 w-[80%] outline-none'min={1} max={10000} />
                        <p className='mt-1 sm:text-base text-xs '>{warning.connect}</p>
                    </div>
                    <div className='w-[33%] h-full'>
                    <label className='text-dark_red font-bold sm:text-base text-xs'>DURATION</label>
                        {/* <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} /> */}
                        <select defaultValue={datas.duration} onChange={(t)=>setDatas(el=>({...el,duration:t.target.value}))} className='h-8 outline-none border-b border-dark_red' name="" id="">
                           <option value="" >Month</option>
                           {months.map((el,index)=> <option key={index} value={el}>{el} month</option>)}
                          
                        </select>
                        <p className='mt-1 sm:text-base text-xs'>{warning.duration}</p>
                    </div>
                </div>
                <div className='w-full h-10  mb-2'>
                    <select onChange={handleFeature} className='w-[40%] outline-none rounded-xl sm:h-[80%] h-[50%] sm:text-base text-xs bg-dark_red text-white' name="features" id="">
                        <option value="">Features</option>
                        <option value="Video call">VIDEO CALL</option>
                        <option value="Umlimited message">UNLIMITED MESSAGE</option>
                        <option value="Suggestion">SUGGESTION BY US</option>
                        <option value="Priority">GET PRIORIY</option>
                    </select>
                </div>
                <div className='w-[100%] h-[30%] bg-gray-400'>
                {handleFeatureState.map((el,index)=>(
                        <div key={index} className='w-full h-[20%] mt-2 bg-dark_red  flex'>
                       
                        <div className='w-[90%] h-full flex  items-center text-white px-2 '>
                            
                            <p >{index+1}.<span className='pl-2'>{el}</span></p>
                        </div>
                        <div onClick={()=>handleClose(el)} className='w-[10%] h-full text-center text-white font-black'>
                            X
                        </div>
                    </div>    
                        ))}
                    
                </div>
                <button onClick={handleSubmit} className='border-2 border-red_FA0000 mt-2 w-[30%] h-[6%] font-bold text-dark_red rounded-xl'>SUBMIT</button>
            </div>
        </div>
    </div>
  )
}
