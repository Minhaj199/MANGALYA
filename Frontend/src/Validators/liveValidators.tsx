import { Dispatch,SetStateAction } from "react"
import { CredentialInterface } from "../user/Signup/Credentials"


export function Validator_(setWarning:Dispatch<SetStateAction<CredentialInterface>>,key:string,value:string,password?:string){

    if(key==='FIRST NAME'){
        if(value.trim().length<5||value?.trim().length>10){
            setWarning((el)=>{
                return {...el,[key]:'Charector should b/w 5-10'}
            })
        }else{
            setWarning((el)=>{
                return {...el,[key]:''}
            })
        }
    }
    if(key==='SECOND NAME'){
        if(value.trim().length<2||value?.trim().length>10){
            setWarning((el)=>{
                return {...el,[key]:'Charector should b/w 5-10'}
            })
        }else{
            setWarning((el)=>{
                return {...el,[key]:''}
            })
        }   
    }
    if(key==='DATE OF BIRTH'){
       const birthDate=new Date(value)
        const today=new Date();
        let age=today.getFullYear()-birthDate.getFullYear()
        let monthdiff=today.getMonth()-birthDate.getMonth()
        let dayDiff=today.getDate()-birthDate.getDate()
        if(monthdiff<0||(monthdiff===0&&dayDiff<0)){
            --age
        }
        if(age<18||age>60){
            setWarning((el)=>{
                return {...el,[key]:'Age must between 18-60'}
            })
        }else{
            setWarning((el)=>{
                return {...el,[key]:''}
            })
        }
    }
    if(key==='EMAIL'){
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid:boolean=emailRegex.test(value)
        if(!isValid){
         setWarning(el=>({...el,[key]:'Insert valid email'}))
        }else{
            setWarning(el=>({...el,[key]:''}))
        }
    }
    if(key==='EMAIL'){
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid:boolean=emailRegex.test(value)
        if(!isValid){
         return setWarning(el=>({...el,[key]:'Insert valid email'}))
        }else{
            return setWarning(el=>({...el,[key]:''}))
        }
    }
    if(key==='PASSWORD'){
        // alert('hello')
        if(value.trim().length<5||value.trim().length>10){
            setWarning((el)=>{
                return {...el,[key]:'password should b/w 5-10'}
            })
        }else{
            setWarning((el)=>{
                return {...el,[key]:''}
            })
        }
    }
    if(key==='CONFIRM PASSWORD'){
        
        
        if(!password){
            setWarning((el) => {
                return { ...el, [key]: 'Password must be provided first' };
              });
              
        }
        else if(value!==password){
            setWarning((el)=>{
                return {...el,[key]:'password not match'}
            })
            
        }else if (value===password){
            // alert(value)
            // alert(password)
            setWarning((el)=>{
                return ({...el,[key]:""})
            })
            
        }
    }
}
