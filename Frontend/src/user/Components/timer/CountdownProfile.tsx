import React, { useContext, useRef } from 'react'
import { useTimer } from 'react-timer-hook'
import { SignupContext } from '../../../GlobalContext/signupData'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../utils/axiosUtils'
import { TimerProbs } from './Countdown'
export const CountdownProfile:React.FC<TimerProbs> =({expiryTimeStamp,from,status}) => {

   
     
    
     // const timeRef=useRef(expiryTimeStamp)
 
   
 
         const { seconds, minutes,restart}=useTimer({expiryTimestamp:expiryTimeStamp})
        
        async function resetProfileOtp(){
             restart(new Date(Date.now()+120000))
             await request({url:'/user/otpRstPsword',method:'post'})
         }
        
         
         const userProfile=<>
         <span>{minutes}:{seconds}</span>
         <span className='cursor-pointer' onClick={resetProfileOtp}>RESET</span>
         </>
         return (
     userProfile
         
       )
     
 }