import React, { useContext, useState } from "react"
import { Forgot_Props } from "./Forgot_first"
import { Countdown } from "../../timer/Countdown" 
import { EmailForFogot } from "../../../../GlobalContext/signupData"
import { useNavigate } from "react-router-dom"
import { request } from "../../../../utils/axiosUtils"

export const Forgot_second:React.FC<Forgot_Props> = ({changeToggle}) => {
  const navigate=useNavigate()
  const contest=useContext(EmailForFogot)
    if(!contest){
      navigate('/')
      return
    }
  const {forgotEmail}=contest

  const [expiryTimeStamp]=useState<Date>(new Date(Date.now()+120000))
  const [loading,setLoading]=useState<boolean>(false)
  const [warning,setWarning]=useState('')
  const [otp,setOpt]=useState<string>('')
  function handleReset(){
    if(otp.length<0){
      setWarning('Blanke not allowed')
    }else if(otp.length>7||otp.length<6){
      setWarning('Insert 6 Charectors')
    }else{
    
      setWarning('')
      try {
        const resonse=async()=>{
          setLoading(true)
          return await request({url:'/user/otpValidation',method:'post',data:{otp,email:forgotEmail}})
        }
        resonse().then((value:unknown)=>{
          let result=value as {message:string}|false
          console.log(result&&result.message&&result.message==="OTP valid")
          setLoading(false)
          if(result&&result.message&&result.message==="OTP valid"){
          changeToggle('5')
          
          }
        }).catch(result=>{
          setLoading(false)
          throw new Error('error on validation')
        })
      } catch (error) {
        
      }
      
    }
  }
  return (
    loading?<><h1>Loading......</h1></>:
    <div className="flex items-center flex-col h-[400px] w-60 sm:w-1/3 sm:h-[400px] relative sm:top-32 sm:left-96 top-28 left-14   bg-[rgba(0,0,0,0.7)]">
    <div  className=" w-full h-10 flex justify-end items-center pr-4 ">
          <p className=" text-white cursor-pointer" onClick={()=>changeToggle('3')}>X</p>
         </div>
    <p className="font-aborato text-white text-xl mt-11">
      FORGOT PASSWORD
    </p>
    <label className="font-aborato pt-10 pb-5 text-white" htmlFor="">
      ENTER OTP
    </label>
    <input
    value={otp}
    onChange={(t)=>setOpt(t.target.value)}
      type="text"
      className="block text-center  bg-transparent border w-42 border-input_dark sm:w-56 h-10 text-gray-300 pl-8"
    />
    <div>
    <p className="text-yellow-300 w-full h-10 mt-3">{warning?warning:''}</p>

    </div>
    <Countdown expiryTimeStamp={expiryTimeStamp} from="forgot" email={forgotEmail} />
    <button onClick={()=>handleReset()} className='border border-white w-20 h-10 text-white mt-10'>UPDATE</button>
  </div> 
  )
}