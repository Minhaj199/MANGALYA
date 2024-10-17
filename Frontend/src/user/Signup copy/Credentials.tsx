import { useState } from "react";
import { credential_validation } from "../../Validators/signupValidator";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Credential.css'



export interface CredentialInterface{
  email:string,
  password:string,
  confirmPass:string
}
export const Credentials = () => {
  const [credentialData,setCredentialData]=useState<CredentialInterface>({email:'',password:'',confirmPass:''})
  const [warnning,setWarnning]=useState<CredentialInterface>({email:'',password:'',confirmPass:''})
  const navigate=useNavigate()
  async function submintCredential(){
   
   if(credential_validation(credentialData,setWarnning)){
      try {
      const response= await axios({
          url:'http://localhost:8000/user/signup',
          method:'post',
          data:{email:credentialData.email,password:credentialData.password}
        })
        if(response.data?.status===false){
          setWarnning(el=>({...el,email:response.data.message}))
        }
        if(response.data?.message==='sign up completed'){
          alert(response.data.message)
        }
        
        setCredentialData({confirmPass:'',email:'',password:""})
      } catch (error) {
        alert('server crashed')
      }  
   }else{
    
   }
  }
  function handleEmail(email:string){
    setWarnning(el=>({...el,email:''}))
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const isValid:boolean=emailRegex.test(email)
    if(!isValid){
      setWarnning(el=>({...el,email:'Email should be valid'}))
    }
  }
  function handleInfo(password:string){
    setWarnning(el=>({...el,password:''}))
    if((password.length<6)||password.length>12){
      setWarnning(el=>({...el,password:'password should be between 6-12 charetors'}))
    }
  }
  function handleMatching(cPassword:string){
    setWarnning(el=>({...el,confirmPass:''}))
    if(cPassword!==credentialData.password){
      setWarnning(el=>({...el,confirmPass:'Passoword not matching'}))
    }
  }
  return (
    <div id="container2" className=" flex justify-center items-center w-screen h-svh  bg-cover bg-center">
      <div className="w-full h-20 fixed top-0 right-0 left-0 p-5 ">
        <p className="font-Lumanosimo text-white text-sm sm:text-base cursor-pointer" onClick={()=>navigate('/')}>BACK</p>
      </div>
      <div className="w-3/5 h-5/6 sm:w-2/5 sm:h-[600px] bg-[rgba(99,25,25,0.5)] rounded-2xl">
            <div className="w-full h-20 flex justify-center items-center">
            <div className="h-20 w-20 sm:h-full sm:w-[90px]   rounded-full relative sm:top-2">
                <img src="/createProfile.png" className="w-full h-full" alt="" />
            </div>
            </div>
            <div className="w-full h-[375px] sm:h-[425px]  flex flex-col items-center">
                <p className="font-aborato text-[10px] sm:text-xl text-white pt-3 sm:pt-8">FINAL STEP, please COMPLETE VERIFICATION  </p>
                <p className="text-white text-xs sm:text-base sm:mr-[279px] mb-2 mt-5">EMAIL</p>
                <input type="email" value={credentialData.email} onChange={(t)=>{setCredentialData(prev=>({...prev,email:t.target.value})),handleEmail(t.target.value)}} className="w-3/5 pl-5 border  border-dark_red  outline-none h-9"  />
                <p className="text-white   text-xs mt-2   ">{warnning.email?warnning.email:''}</p>
                <p className="text-white sm:mr-[240px] sm:text-base mb-2 mt-4 text-xs">PASSWORD</p>
                <input name="password" value={credentialData.password} onChange={(t)=>{
                  
                  setCredentialData(prev=>({...prev,password:t.target.value})),handleInfo(t.target.value)}
                  
                  } className="w-3/5 border pl-5 border-dark_red  outline-none h-9" type="password" />
                <p className="text-white  mb-2 mt-2 text-xs">{warnning.password?warnning.password:''}</p>
                <p className="text-white sm:mr-[170px] mb-2 mt-2 sm:text-base text-xs" >CONFIRM PASSWORD</p>
                <input value={credentialData.confirmPass}  onChange={(t)=>{setCredentialData(prev=>({...prev,confirmPass:t.target.value})),handleMatching(t.target.value)}} className="w-3/5 border pl-5  border-dark_red font-roboto font-bold outline-none h-9" type="password" />
                <p className="text-white  mb-2 mt-2 text-xs">{warnning.confirmPass?warnning.confirmPass:''}</p>
            </div>
        <div className="w-full h-12   flex justify-center items-center">
            <button onClick={submintCredential} className="bg-dark_red w-1/3 h-10 rounded-2xl">Next</button>
        </div>
        
      </div>
    </div>
  );
};
