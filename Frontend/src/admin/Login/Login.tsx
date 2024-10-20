import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { request } from "../../utils/axiosUtils";

import { LoginValidatorAdmin } from "../../Validators/LoginValidatorForAdmin"; 
import { useNavigate } from "react-router-dom";

 export interface AdminInterface{
  email:string
  password:string
}
export const Login: React.FC = () => {
 const nevigate=useNavigate()
  const [adminForm,setAdminForm]=useState<AdminInterface>({email:'',password:''})
  interface warning{
    username:string
    password:string
  }
  const [warnnig,setWarning]=useState<warning>({username:'',password:''})
async function handleSubmit(){
   
interface LoginType{
  username?:string;
  adminVerified?:string,
  password?:string

}

   if(LoginValidatorAdmin(adminForm,setWarning)){

     
     try {
       
      const response:LoginType=await request({url:'/admin/login',method:'post',data:adminForm})
       
        if(typeof response==='object'&&response!==undefined){
          if(Object.keys(response).includes('username')){
            setWarning(prev => ({ ...prev, username: response.username||'', password: '' })); 
            
          }else if (Object.keys(response).includes('password')){
            
            setWarning(prev => ({ ...prev, password:response.password||'', username:'' })); 
            console.log(warnnig)
          }else if (Object.keys(response).includes('adminVerified')){
            if(response?.adminVerified){
              console.log(response)
              nevigate('/admin/manageUser')
            }
            
          }
        }else{
          console.log('error')
        }
      } catch (error) {
        console.log('internal server error at login 21')
      }
    }
      
  }
  return (
    <div
      id="container"
      className="w-screen h-screen flex justify-center items-center flex-col "
    >
      <div
        id="logo"
        className="w-28 h-28 sm:w-34 sm:h-34 sm:top-14     rounded-full absolute top-11  border-red   "
      >
        <img src="./adminLogin_.png" className="im" alt="x" />
      </div>
      <div className="h-4/6 w-4/6 sm:h-4/6 sm:w-2/6  bg-white rounded-[20px] border-4 border-dark_red   ">
        <div className="w-full h-2/5 flex justify-center   items-center">
          <p className="font-inter font-extrabold text-2xl sm:text-3xl mt-12 text-dark_red">
            WELCOME ADMIN
          </p>
        </div>
        <div className="w-full h-2/5 flex justify-center space-x-* items-center  flex-col">
          <div className="w-3/4 h-12 bg-black flex">
            <div className="h-full w-2/12 bg-red_FA0000 flex justify-center items-center">
              <img className="w-2/3 h-2/3" src="./avatar-design.png" alt="" />
            </div>
            <div className="h-full w-10/12">
              <input
              onChange={(e)=>setAdminForm(prev=>({...prev,email:e.target.value}))}
                className="w-full h-full bg-light_red text-white p-5 font-inter"
                type="text" 
                placeholder="User Name"
              />
            </div>
          </div>
          <p className="text-red-600  w-52 h-12">{warnnig?.username?warnnig.username:''}</p>
          <div className="w-3/4 h-12 bg-black flex">
            <div className="h-full w-2/12 bg-red_FA0000  flex justify-center items-center">
              <img className="w-2/4 h-2/4" src="./lock.png" alt="" />
            </div>
            <div className="h-full w-10/12">
              <input
              onChange={(t)=>setAdminForm(prev=>({...prev,password:t.target.value}))}
                className="w-full h-full bg-light_red text-white p-5 font-inter outline-none"
                type="password"
                placeholder="Enter Password"
                
              />
            </div>
          </div>
          <p className="text-red-600  w-52 h-12 ">{warnnig?.password?warnnig.password:''}</p>
        </div>
        <div className="w-full h-1/5  flex justify-center items-center">
            <button onClick={handleSubmit} className="w-2/5 h-10 bg-white font-inter font-bold  border-2 border-dark_red rounded-full text-dark_red">LOGIN</button>
        </div>
      </div>
    </div>
  );
};
