import React, { useContext, useRef } from 'react'
import { useTimer } from 'react-timer-hook'
import { SignupContext } from '../../../GlobalContext/signupData'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../utils/axiosUtils'
interface TimerProbs{
    expiryTimeStamp:Date,
    from:string
    email?:string
}
export const Countdown:React.FC<TimerProbs> = ({expiryTimeStamp,from,email}) => {

    const navigate=useNavigate()
    const context=useContext(SignupContext)
    if(!context){
        throw new Error
    }
    // const timeRef=useRef(expiryTimeStamp)

    const {signupFirstData}=context
    const { seconds, minutes,restart}=useTimer({expiryTimestamp:expiryTimeStamp})
    async function handleRestart(from:string){
        if(from==='forgot'){
           
            restart(new Date(Date.now()+120000))
            if(email){
                try{
                    await request({url:'/user/otpCreation',method:'post',data:{email,from:'forgot'}})  
                }catch(error){
                    
                }
            }else{
                
                navigate('/signup')
            }
        }else{
            
    
            restart(new Date(Date.now()+120000))
            if(signupFirstData.EMAIL){
                try{
                    await request({url:'/user/otpCreation',method:'post',data:{email:signupFirstData.EMAIL,from:'forgot'}})  
                }catch(error){
                    
                }
            }else{
                navigate('/signup')
            }
        }
    }
   
    const singup=(<p className="font-sans font-semibold cursor-pointer text-white mt-1"><span>{minutes}:{seconds}</span><span className="pl-14" onClick={()=>handleRestart('signup')}>Resent</span></p>)
    const forgot=<p className='text-white font-aborato '>{minutes}:{seconds} <span className='pl-24 cursor-pointer' onClick={()=>handleRestart('forgot')}>RESET</span></p>
    return (
    (from==='signup')?singup:forgot
    
  )
}
