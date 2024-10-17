import React from "react"
import { Forgot_Props } from "./Forgot_first" 

export const Forgot_second:React.FC<Forgot_Props> = ({changeToggle}) => {
  function handleReset():void{
    changeToggle('1')
    console.log('hii')
  }
  return (
    <div className="flex items-center flex-col h-1/2 w-60 sm:w-1/3 sm:h-[400px] relative sm:top-32 sm:left-96 top-28 left-14   bg-[rgba(0,0,0,0.7)]">
    <p className="font-aborato text-white text-xl mt-11">
      FORGOT PASSWORD
    </p>
    <label className="font-aborato pt-10 pb-5 text-white" htmlFor="">
      ENTER OTP
    </label>
    <input
      type="text"
      className="block outline-none bg-transparent border w-42 border-input_dark sm:w-56 h-10 text-gray-300 pl-10"
    />
    <p className="text-yellow-300 w-32 h-10 mt-3">Email not found</p>
    <p className='text-white font-aborato '>2:00 <span className='pl-24'>RESET</span></p>
    <button onClick={()=>handleReset()} className='border border-white w-20 h-10 text-white mt-10'>UPDATE</button>
  </div> 
  )
}
