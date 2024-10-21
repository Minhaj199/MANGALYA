import { CredentialInterface } from "../user/Signup/Credentials" 
import { Dispatch,SetStateAction } from "react"
import { request } from "../utils/axiosUtils"

export const  credential_validation=async(formData:CredentialInterface,setWarnning:Dispatch<SetStateAction<CredentialInterface>>):Promise<boolean>=>{
    
    if(formData['FIRST NAME']?.trim()===''||formData['FIRST NAME']===undefined){
            setWarnning(el=>({...el,['FIRST NAME']:'Blank not allowed'}))
            return false
        }else if(formData['FIRST NAME'].length>10||formData['FIRST NAME'].length<5){
                setWarnning(el=>({...el,['FIRST NAME']:'Charector should b/w 5-10'}))
                return false
            }
            if(formData['SECOND NAME']?.trim()===''||formData['SECOND NAME']===undefined){
                setWarnning(el=>({...el,['SECOND NAME']:'Blank not allowed'}))
                return false
            }else if(formData['SECOND NAME'].length<2||formData['SECOND NAME'].length>10){
                    setWarnning(el=>({...el,['SECOND NAME']:'Charector should b/w 5-10'}))
                    return false
                }else{
                    setWarnning(el=>({...el,['SECOND NAME']:''}))
                }
            if(formData['DATE OF BIRTH']){
                const birthDate=new Date(formData['DATE OF BIRTH'])
                const today=new Date();
                let age=today.getFullYear()-birthDate.getFullYear()
                let monthdiff=today.getMonth()-birthDate.getMonth()
                let dayDiff=today.getDate()-birthDate.getDate()
                if(monthdiff<0||(monthdiff===0&&dayDiff<0)){
                    --age
                }
                if(age<18||age>100){
                    setWarnning((el)=>({...el,['DATE OF BIRTH']:'Age must be between 18-100'}))
                    return false
                }
            }else{
                setWarnning((el)=>({...el,['DATE OF BIRTH']:'Blank not allowed'}))
                return false
            }
         
            
    if(formData['STATE THAT YOU LIVE']?.trim()===''||formData['STATE THAT YOU LIVE']===undefined){
        setWarnning(el=>({...el,['STATE THAT YOU LIVE']:'please chouse an option'}))
        return false
    }else if(formData['STATE THAT YOU LIVE']?.length>0){
        
       setWarnning(el=>({...el,["STATE THAT YOU LIVE"]:""}))
    }
    if(formData['YOUR GENDER']?.trim()===''||formData['YOUR GENDER']==undefined){

        
        setWarnning(el=>({...el,['YOUR GENDER']:'please chouse an option'}))
        return false
    }else if(formData){
        setWarnning(el=>({...el,["YOUR GENDER"]:""}))
     }
    if(formData['GENDER OF PARTNER']?.trim()===''||formData['GENDER OF PARTNER']===undefined){
        setWarnning(el=>({...el,['GENDER OF PARTNER']:'please chouse an option'}))
        return false
    }else if(formData['GENDER OF PARTNER']?.length>0){
        
        setWarnning(el=>({...el,["GENDER OF PARTNER"]:""}))
     }
    
    
    
    if(formData['EMAIL']){
        
        
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid:boolean=emailRegex.test(formData['EMAIL'])
        if(!isValid){
            setWarnning(el=>({...el,['EMAIL']:'Insert valid email'}))
            return false
        }
        else{
            setWarnning(el=>({...el,['EMAIL']:''}))
            
        }
    }else if(formData['EMAIL']?.trim()===''||formData['EMAIL']===undefined){
        setWarnning(el=>({...el,['EMAIL']:'Insert valid email'}))
        return false
    }
    if(formData['EMAIL']){
        const isExist:any=await request({url:'/user/forgotEmail',method:'post',data:{email:formData['EMAIL']}})
        console.log(isExist)
        if(isExist?.email){
            console.log('84')
            setWarnning(el=>({...el,['EMAIL']:'Email already exist'}))
            return false
        }
    }
    if(formData['PASSWORD']?.trim()===''||formData['PASSWORD']===undefined){
       console.log('here')
        setWarnning(el=>({...el,['PASSWORD']:'Blank not allowed'}))
        return false
    }
    else if(formData['PASSWORD']?.length<5||formData['PASSWORD']?.length>10){
    
        setWarnning(el=>({...el,['PASSWORD']:'password should between 5-10'}))
        return false
    }
    if(formData['PASSWORD']!==formData['CONFIRM PASSWORD']||formData['CONFIRM PASSWORD']===undefined){
      
        setWarnning(el=>({...el,['CONFIRM PASSWORD']:'passowrd not matching'}))
        return false
    }
    
    
    
    return true
}

