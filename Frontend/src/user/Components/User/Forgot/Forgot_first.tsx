import axios from "axios"
import React,{Dispatch,SetStateAction, useState} from "react"

function validateEmail(email:string){
  const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(emailRegex.test(email)){
    return true
    
  }
 return false
}
export interface Forgot_Props{
  changeToggle:Dispatch<SetStateAction<string>>
}

export const Forgot_first:React.FC<Forgot_Props> = ({changeToggle}) => {
  const [email,setEmail]=useState<string>('')
  const [warnning,setWarning]=useState<string>('')
  async function handle_validate():Promise<void>{
   if(validateEmail(email)){
    try {
      const response=await axios({
        url:'http://localhost:8000/user/forgotEmail',
        method:'post',
        data:{email}
      })
      console.log(response.data)
      
      if(response.data?.email){
        changeToggle('4')
      }
      if(!response.data){
        setWarning('Email not found')
      }
    } catch (error) {
      console.log(error)
    }
    return
   }else{
    setWarning('not valid a email')
   }
  }
  return (
    <div className="flex items-center flex-col h-1/2 w-60 sm:w-1/3 sm:h-[350px] relative sm:top-32 sm:left-96 top-28 left-14   bg-[rgba(0,0,0,0.7)]">
          <p className="font-aborato text-white text-xl mt-11">
            FORGOT PASSWORD
          </p>
          <label className="font-aborato pt-10 pb-5 text-white" htmlFor="">
            EMAIL ID
          </label>
          <input
          onChange={(t)=>setEmail(t.target.value)}
            type="text"
            className="block focus:bg-gray-400 bg-transparent  border w-42 border-input_dark sm:w-72 h-10 p-5 text-black"
          />
          <p className="text-yellow-300 w-31 h-10 mt-3">{warnning?warnning.toUpperCase():''}</p>
          <button onClick={handle_validate} className="border border-white mt-5 w-28 sm:text-base  text-sm sm:h-10 :h-8 font-aborato text-white">VALIDATE</button>
        </div>
  )
}
