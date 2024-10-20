import React, { useContext } from 'react'
import { useTimer } from 'react-timer-hook'
import { SignupContext } from '../../../GlobalContext/signupData'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../utils/axiosUtils'
interface TimerProbs{
    expiryTimeStamp:Date,
}
export const Countdown:React.FC<TimerProbs> = ({expiryTimeStamp}) => {
    const navigate=useNavigate()
    const context=useContext(SignupContext)
    if(!context){
        throw new Error
    }
    const {signupFirstData}=context
  const { seconds, minutes,restart}=useTimer({expiryTimestamp:expiryTimeStamp})
 async function handleReastart(){
    restart(new Date(Date.now()+120000))
    if(signupFirstData.EMAIL){
        try{
            await request({url:'/user/otpCreation',method:'post',data:{email:signupFirstData.EMAIL}})  
        }catch(error){

        }
    }else{
        navigate('/signup')
    }
  }
    return (
    
    <p className="font-sans font-semibold cursor-pointer text-white mt-1"><span>{minutes}:{seconds}</span><span className="pl-14" onClick={handleReastart}>Resent</span> </p>  
  )
}
