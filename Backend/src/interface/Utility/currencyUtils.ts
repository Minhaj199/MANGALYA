import axios from "axios"



export async function fetchINRtoUSDRate():Promise<number>{
    try {
        const response:any=await axios.get(`https://v6.exchangerate-api.com/v6/c4dab206cfe334bfa79e7e18/pair/USD/INR`)
        
        
        return response?.data.conversion_rate|| 89
       
    } catch (error:any) {
        throw new Error(error.message||'error on exchange rate')
    }
}