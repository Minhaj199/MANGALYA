import { Types } from "mongoose";
import { chatModel } from "../../Infrastructure/db/chatModel";


export async function getMessageCount(from:unknown,id:unknown){
   
    
    if(from==='nav'&&typeof from==='string'&&typeof id==='string'){
        
     try{
        
        
        // if(response.length>=1){
           
        //     const ids:string[]=[]
        //     response.forEach((el)=>{
               
        //         ids.push(el.chats._id)
        //     })
          
        //     return {count:ids.length,ids:ids}
        // }else{
        //     return {count:0}
        // }
        
     }catch(error){
         console.log(error)
        return {count:0}
     }
       
    }else{
        return 0
    }
}