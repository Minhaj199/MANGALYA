import React, { useContext, useState } from "react";
import { credential_validation } from "../../Validators/signupValidator";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Credential.css'
import { Inputs } from "../Components/User/signupInputs/Inputs";
import { SignupContext } from "../../GlobalContext/signupData";
import { request } from "../../utils/axiosUtils";
import { Loading } from "../Components/Loading/Loading";




export interface CredentialInterface{
  [key:string]:string
}
export interface InputArrayProbs {
  inputFields: {
    linkingName: string;
    inputType: string;
    inputName: string;
    option?:string[]
  }[];
}
export const Credentials:React.FC<InputArrayProbs> = ({inputFields}) => {
  const context =useContext(SignupContext)
  
    if(!context){
      throw new Error('no contex')
    }
    
  const {setSignupFirst}=context
  
    
  const [credentialData,setCredentialData]=useState<CredentialInterface>({})
  const [warnning,setWarnning]=useState<CredentialInterface>({})
  const [loding,setLoding]=useState<boolean>(false)
  const navigate=useNavigate()
  async function submintCredential(t:any){
    t.preventDefault()
  
      if(await credential_validation(credentialData,setWarnning)){
        alert('validated')
          const signupFirst={
            'SECOND NAME':credentialData['SECOND NAME'],
          'DATE OF BIRTH':credentialData['DATE OF BIRTH'],
          'STATE THAT YOU LIVE':credentialData['STATE THAT YOU LIVE'],
          'YOUR GENDER':credentialData['YOUR GENDER'],
          'GENDER OF PARTNER':credentialData['GENDER OF PARTNER'],
          'EMAIL':credentialData['EMAIL'],
          'PASSWORD':credentialData['PASSWORD'],
          'FIRST NAME':credentialData['FIRST NAME']
        }
        setLoding(true)
        const Response=await request({url:'/user/otpCreation',method:'post',data:{email:credentialData.EMAIL}})
        try {
      if(Response&&typeof Response==='object'&&Object.values(Response).includes('Email send successfull')){
         setCredentialData({})
         navigate("/otpVerification")
        
        }else{
          alert()
     }
      
    } catch (error) {
      
    } 
      setSignupFirst(signupFirst) 
    }
    console.log(credentialData)
    
  }
 
  
  return (
    <div id="container2" className=" flex justify-center items-center w-screen md:h-svh sm:h-auto  h-auto sm:pt-0 pt-12  bg-cover bg-center">
      <div className="w-full h-20 fixed top-0 right-0 left-0 p-5 ">
        <p className="font-Lumanosimo text-white text-sm sm:text-base cursor-pointer" onClick={()=>navigate('/')}>BACK</p>
      </div>
        
        {loding?
      <Loading/>
        : <div className="w-3/5 sm:w-4/5 sm:h-auto bg-[rgba(99,25,25,0.5)] rounded-2xl">
            <div className="w-full h-20 flex justify-center items-center">
            <div className="h-20 w-20 sm:h-full sm:w-[90px]   rounded-full relative sm:top-2">
                <img src="/createProfile.png" className="w-full h-full" alt="" />
            </div>
            </div>
            <div className="w-full h-auto sm:h-auto md:h-[425px]  flex flex-col items-center ">
                <p className="font-aborato text-[10px] sm:text-xl text-white pt-3 sm:pt-8 pb-7">JOIN OUR FAMILY  </p>
                <div className="h-auto w-5/6 flext grid sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 grid-cols-1 gap-y-5 ">
                 <Inputs inputFields={inputFields}setCredentialData={setCredentialData} setWarnning={setWarnning} CredentailData={credentialData} Warning={warnning}/>
               
                </div>
                
            </div>
        <div className="w-full h-12   flex justify-center items-center">
            <button onClick={(t)=>submintCredential(t)} className="bg-dark_red w-1/3 h-10 rounded-2xl mb-5 mt-3">Next</button>
        </div>
        
      </div>}
     
    </div>
  );
};
