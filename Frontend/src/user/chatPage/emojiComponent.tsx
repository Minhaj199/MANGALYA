import axios from "axios"
import { useEffect } from "react"


export const EmogiComponent=()=>{


    useEffect(()=>{
      async function  fetchEmogi(){
          const response=await fetch('https://emoji-api.com/emojis?access_key=641ce8c649a23c8e0934d234697cf00b744ef781')
          console.log(response)
      }
      fetchEmogi()
    },[])
    return(
        <>
    <h1>i am emogi</h1>   
        </>
    )
}