import React,{createContext,useState,ReactNode} from "react";



export type signupFirst={
        'SECOND NAME':string;
        'DATE OF BIRTH':string
        'STATE THAT YOU LIVE':string,
        'YOUR GENDER':string;
        'GENDER OF PARTNER':string;
        'EMAIL':string;
        'PASSWORD':string;
        'FIRST NAME':string;
    }        
interface SignupContextType{
    signupFirstData:signupFirst;
    setSignupFirst:React.Dispatch<React.SetStateAction<signupFirst>> 
}

export const SignupContext=createContext<SignupContextType|null>(null)
interface SignupProvider {
    children:ReactNode
}
export const  SignupProvider=({children}:SignupProvider)=>{
    const [signupFirstData,setSignupFirst]=useState<signupFirst>({"FIRST NAME":'',"SECOND NAME":'',"DATE OF BIRTH":'',"GENDER OF PARTNER":'',"STATE THAT YOU LIVE":'',"YOUR GENDER":'','EMAIL':'','PASSWORD':''})

    return(
        <SignupContext.Provider value={{signupFirstData,setSignupFirst}}>
            {children}
        </SignupContext.Provider> 
    )
}