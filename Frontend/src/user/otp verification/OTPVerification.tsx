import {  useContext, useState } from "react";
import {  useNavigate } from "react-router-dom";
import './Credential.css'
import { SignupContext } from "../../GlobalContext/signupData";
import { Countdown } from "../Components/timer/Countdown";
import { request } from "../../utils/axiosUtils";
import { Loading } from "../Components/Loading/Loading";



export interface CredentialInterface{
  [key:string]:string
}
// interface Email{
//   email:string
// }

export const OTPVerification:React.FC = () => {
  const navigate=useNavigate()
  const context=useContext(SignupContext)
  if(!context){
    throw new Error('')
  }
  const {signupFirstData,setSignupFirst}=context
  const [otp,setOpt]=useState<string>('')
  const [warning,setWarning]=useState<string>()
  const [expiryTimeStamp]=useState<Date>(new Date(Date.now()+120000))
  const [loading,setLoading]=useState<boolean>(false)
  async function handleReset(){
    if(otp.length===6){
     
      setWarning('')
      try {
        if(!signupFirstData.EMAIL){
         navigate('/signup')
        }  
        setLoading(true)
      const Response:any=await request({url:'/user/otpValidation',method:'post',data:{otp:otp,email:signupFirstData.EMAIL}})
      
      if(Response){
        if(Response?.message==='OTP valid'){
          alert('OTP is valid')
          const resonse:any=await request({url:'/user/firstBatchData',method:'post',data:signupFirstData})
          if(resonse?.message&&resonse.message==="sign up completed"){
            setSignupFirst({"FIRST NAME":'',"SECOND NAME":'',"DATE OF BIRTH":'',"GENDER OF PARTNER":'',"STATE THAT YOU LIVE":'',"YOUR GENDER":'','EMAIL':'','PASSWORD':''})
            navigate('/')
          }
        }else if(Response?.message==='OTP not valid'){
          setLoading(false)
          alert('not valid')
          setWarning(Response?.message)
        }
      }else{
        throw new Error('no response')
      }
    } catch (error) {
      
    }
    
   }else{
    setWarning('please 6 charectors')
   }
  }
 
  return (
    <div id="container2" className=" flex flex-col justify-center items-center w-screen md:h-svh sm:h-svh  h-svh sm:pt-0 pt-12  bg-cover bg-center">
      <div className="w-full h-20 fixed top-0 right-0 left-0 p-5 ">
        <p className="font-Lumanosimo text-white text-sm sm:text-base cursor-pointer" onClick={()=>navigate('/signUp')}>BACK</p>
      </div>
      {loading?<Loading/>:
      <>
      <div className="w-28 relative top-[50px] h-28 rounded-full  ">
        <img src="/createProfile.png" alt="" />
      </div>
      <div className="flex  items-center flex-col  sm:h-96 sm:w-2/4 md:w-2/4 md:h-96 lg:h-96  w-5/6 h-96 lg:w-1/3 rounded-3xl bg-otp_red">
      <div className="h-[100px] w-full  flex justify-center items-end">
        <p className="font-inter  text-white text-2xl">ENTER OTP</p>      
      </div>
      <div className="flex-col h-3/6 w-full  flex justify-center items-center">
       <input type="text" max={6} value={otp} onChange={(t)=>setOpt(t.target.value)}  className="h-16 bg-slate-300 w-1/3 font-black  font-mono text-2xl  text-center" />
       <p className="font-sans font-semibold cursor-pointer text-white mt-1">{warning?warning:warning}</p>      
       <Countdown expiryTimeStamp={expiryTimeStamp}/>    
      </div>
      <button className="bg-white py-3 px-6 rounded-full font-bold text-neutral-900 font-inter" onClick={handleReset}>SUBMIT</button>
      </div>
      </>}
    </div>
  );
};
