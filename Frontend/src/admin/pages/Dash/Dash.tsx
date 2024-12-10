import React, { useEffect, useState } from 'react'
import { DashCard } from './DashCard'
import PieChart from './Graphs/PieChart'
import BarChart from './Graphs/BarGraph'
import { alertWithOk } from '../../../utils/alert/sweeAlert'
import { request } from '../../../utils/axiosUtils'


export const Dash = () => {
  const [dashCount,setDashCount]=useState<{revenue:number,suscriber:number,user:number}>()
  useEffect(()=>{
    async function FetchData(){
      try {
      const response:{MonthlyRevenue:number,SubscriberCount:number,UserCount:number,message:string}=await request({url:'/admin/getDataToDash?from=dashCount'})  
    
        if(response.message){
          throw new Error(response.message)
        }
        setDashCount({revenue:response.MonthlyRevenue,suscriber:response.SubscriberCount,user:response.UserCount})
    } catch (error:any) {
          alertWithOk('Dash error',error.message||'error on dash','error')
      
        }
    }
    FetchData()
  },[])
  return (
    <div className=' w-[100%]  h-[100%] flex  items-center flex-col'>
      <div className='w-[80%] h-[30%] shadow shadow-theme-blue mt-10 flex justify-around items-center'>
        <DashCard Data={dashCount?.revenue||0} Title={'TOTAL REVENUE'}/>
        <DashCard Data={dashCount?.suscriber||0} Title={'SUBSCRIBER COUNT'}/>
        <DashCard Data={dashCount?.user||0} Title={'USER COUNT'}/>
      </div>
      <div className='w-[80%] h-[50%] mt-10  flex justify-between'>
        <div className='w-[48%] h-full shadow shadow-theme-blue'>
        <PieChart/>
        </div>
        <div className='w-[48%] h-full shadow shadow-theme-blue  '>

        <BarChart/>
        </div>
      </div>

    </div>
  )
}
