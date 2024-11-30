import React,{useState} from 'react'
import StripeCheckout, { Token } from 'react-stripe-checkout'
import { request } from './utils/axiosUtils'



export const Sample = () => {
  const[plan,setPlan]=useState({
    name:'silver',
    amount:'200'
  })
  const makePayment=async (token:Token)=>{
    const body={
      token,
      plan
    }
    const headers={
      'Content-Type':'application/json'
    }
    try {
      
      const response=await request({url:'/user/payment',data:body, method:'post'})
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <div className='w-full h-[800px] bg-slate-800 flex justify-center items-center'>
      
    </div>
  )
}
