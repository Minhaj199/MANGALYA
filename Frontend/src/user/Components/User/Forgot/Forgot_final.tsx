import React, { useContext, useState } from "react"
import { Forgot_Props } from "./Forgot_first" 
import { EmailForFogot } from "../../../../GlobalContext/signupData"
import { useNavigate } from "react-router-dom"
import { request } from "../../../../utils/axiosUtils"
import { Loading } from "../../Loading/Loading"
import { alertWithOk, handleAlert } from "../../../../utils/sweeAlert"

export const Forgot_Final:React.FC<Forgot_Props> = ({changeToggle}) => {
  const navigate=useNavigate()
  const contest=useContext(EmailForFogot)
    if(!contest){
      navigate('/')
      return
    }
  const {forgotEmail}=contest

  
  const [password,setPassword]=useState<string>('')
  const [confirm,confirmSetPassword]=useState<string>('')
  const [loading,setLoading]=useState<boolean>(false)
  const [warning,setWarning]=useState<{password:string,confirm:string}>({password:'',confirm:''})
  
  function handleReset(){

    if(password.trim()===''){
      setWarning({password:'Blank not allowed',confirm:''})
      
    }else if(confirm.trim()===''){
      setWarning({password:'',confirm:'Blank not allowed'})
    }else if(password.length>10||password.length<5){
      setWarning(el=>({...el,password:'Password must be 5-10 chars'}))
    }else if(password!==confirm){
      setWarning(el=>({...el,password:'not matching'}))
    }
    else{
      setWarning({password:'',confirm:""})
      try {
        const resonse=async()=>{
          setLoading(true)
          return await request({url:'/user/changePassword',method:'patch',data:{email:forgotEmail,password}})
        }
        resonse().then((value:unknown)=>{
          let result=value as {message:string}|false
          console.log(result)
          console.log(result&&result.message&&result.message==="password changed")
          setLoading(false)
          if(result&&result.message&&result.message==="password changed"){
            alertWithOk('Password Reset','Password changed,please try again',"info")
          changeToggle('2')
          
          }
        }).catch(result=>{
          if(result){

            setLoading(false)
          }
          throw new Error('error on validation')
        })
      } catch (error) {
        
      }
      
    }
  }
  return (
    loading?<><Loading/></>:
    <div className="flex items-center  flex-col h-[400px] w-60 sm:w-1/3 sm:h-[400px] relative sm:top-32 sm:left-96 top-28 left-14   bg-[rgba(0,0,0,0.7)]">
    <div  className=" w-full h-10 flex justify-end items-center pr-4 ">
          <p className=" text-white cursor-pointer" onClick={()=>changeToggle('3')}>X</p>
         </div>
    <p className="font-aborato text-white text-xl mt-11">
      FORGOT PASSWORD
    </p>
    <input
    value={password}
    placeholder="PASSWORD"
    onChange={(t)=>setPassword(t.target.value)}
      type="password"
      className="block  mt-5  bg-transparent border w-42 border-input_dark sm:w-64 h-10 text-gray-300 pl-8"
    />
    <div className="w-3/5 p-3 h-12 font-inter text-gray-200 ">
    <p className="text-sm">{warning.password}</p>
    </div>
    <input
    placeholder="COMFIRM PASSWORD"
    value={confirm}
    onChange={(t)=>confirmSetPassword(t.target.value)}
      type="password"
      className="block   bg-transparent border w-42 border-input_dark sm:w-64 h-10 text-gray-300 pl-8"
    />
    <div className="w-3/5 p-3 h-12 font-inter text-gray-200 ">
    <p className="text-sm">{warning.confirm}</p>
    </div>
    <div>
   

    </div>
    <button onClick={()=>handleReset()} className='border border-white w-20 h-10 text-white mt-5'>UPDATE</button>
  </div> 
  )
}
