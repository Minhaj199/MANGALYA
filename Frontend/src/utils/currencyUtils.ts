import axios from "axios";
import { alertWithOk } from "./alert/sweeAlert";



export async function fetchINRtoUSDRate():Promise<number>{
    try {
        const response:any=await axios.get(`https://v6.exchangerate-api.com/v6/c4dab206cfe334bfa79e7e18/pair/EUR/INR`)
        
        
        // return response?.data.conversion_rate|| 89
        return 89
    } catch (error) {
        alertWithOk('Exchage Rate','Error occured on exchange rate',"error")
        return 80
    }
}