import { CredentialInterface } from "../user/Signup/Credentials"
import { Dispatch,SetStateAction } from "react"


export const credential_validation=(formData:CredentialInterface,setWarnning:Dispatch<SetStateAction<CredentialInterface>>):boolean=>{
    if(formData.email.trim()===''){
        setWarnning(el=>({...el,email:'Blank not allowed'}))
        return false
    }else if(formData.email){
        
        setWarnning(el=>({...el,email:''}))
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid:boolean=emailRegex.test(formData.email)
        if(!isValid){
          setWarnning(el=>({...el,email:'Email should be valid'}))
          return false
        }
    
    }
     if(formData.password===''){
     setWarnning(el=>({...el,password:'password blank not allowed'}))
        return false
    }else if((formData.password.length<6)||formData.password.length>12){
        setWarnning(el=>({...el,password:'password should be between 6-12 charetors'}))
        return false
    }
    else if(formData.confirmPass!==formData.password){
        setWarnning(el=>({...el,confirmPass:'Passoword not matching'}))
        return false
    }

    return true
}

