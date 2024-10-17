import axios from "axios"
import { Forgot_Props } from "../Forgot/Forgot_first"
import { useState } from "react"
import { LoginValidator } from "../../../../Validators/LoginValidator"


import React from "react"
import { useNavigate } from "react-router-dom"
interface userLoginProp extends Forgot_Props{
    loginTogle:string
}
export interface userForm {
    email: string
    password: string
}
 
export const Login:React.FC<userLoginProp> = ({changeToggle,loginTogle}) => {
  const navigate=useNavigate()
  type probs={
    email:string|null
    password:string|null
  }
  const [warning, setWarnning] = useState<probs>({email:null,password:null});
  const [userData, setUserData] = useState<userForm>({
      email: "",
      password: "",
    });
 async function handleLogin(){
  try {
    const isValid:boolean=LoginValidator({...userData},setWarnning)
    if(isValid){
    const response=await axios({
       url:'http://localhost:8000/user/login',
       method:'post',
       data:userData
     });
    console.log(response.data)
     if(response.data.message==='user not found'){
      setWarnning(prev=>({...prev,email:response.data.message,password:null}))
     }
     else if(response.data.message==='password not matched'){
      setWarnning(prev=>({...prev,password:response.data.message,email:null}))
     }
     else if(response.data.message==='password matched'){
      alert('user Logged')
     }
    }
  } catch (error) {
   }
    
  }
    return (
    <div
          className={
            loginTogle !== "2"
              ? "hidden"
              : "h-full w-1/2 sm:w-1/3 bg-[rgba(0,0,0,0.5)] absolute  top-0 right-0 bottom-0"
          }
        >
          <div className="w-full h-11 flex justify-end items-center">
            <h1
              onClick={() => changeToggle("1")}
              className="text-white sm:pr-8 cursor-pointer"
            >
              X
            </h1>
          </div>
          <div className="w-full h-24  flex items-center justify-center">
            <p className="font-aborato text-gray-200 text-sm sm:text-2xl font-light ">
              DOOR TO FIND YOUR PARTNER
            </p>
          </div>
          <div className="w-full h-60 p-6 sm:my-6 sm:mx-12">
            <label
              htmlFor="Email"
              className="block text-white mb-4 font-aborato sm:text-lg text-sm"
            >
              EMAIL ID
            </label>
            <input
            onChange={(t)=>setUserData(prev=>({...prev,email:t.target.value}))}
            
              type="email"
              className="text-white pl-5 block bg-transparent border border-input_dark w-42 sm:w-72 h-10 "
            />
            <p className="w-full h-10 text-yellow-300 opacity-[.7]">
              {warning.email ? warning.email : null}
            </p>
            <label
              htmlFor="password"
              className="block  text-white mb-4 font-aborato sm:text-lg text-sm"
            >
              PASSWORD
            </label>
            <input
            onChange={(t)=>setUserData(prev=>({...prev,password:t.target.value}))}
              type="password"
              className="text-white pl-5 block outline-none bg-transparent border w-42 border-input_dark sm:w-72 h-10"
            />
            <p className="w-full h-10  text-yellow-300 opacity-[.7]">
              {warning.password ? warning.password :null}
            </p>
          </div>
          <div className="w-full h-8  flex justify-end text-sm "  onClick={() => changeToggle("3")}>
            <p
              className="font-aborato text-white mr-12 sm:mr-24 cursor-pointer "
             
            >
              {"FORGOT PASSWORD ?"}
            </p>
          </div>
          <div className="w-full h-[100px]  flex justify-center items-center flex-col">
            <button onClick={handleLogin} className="w-28 h-10 border-2 border-white font-aborato text-white">
              LOGIN
            </button>
            <p className="pt-4 text-white">
              new here ?{" "}
              <span onClick={()=>navigate('/signUp')} className="hover:underline text-gray-200 cursor-pointer">
                sign up for free
              </span>
            </p>
          </div>
        </div>
  )
}
