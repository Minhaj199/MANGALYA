import axios,{AxiosRequestConfig,AxiosResponse} from "axios";

const client=axios.create({baseURL:'http://localhost:8000'})

export const request=async<T>(options:AxiosRequestConfig):Promise<T>=>{
 const token=localStorage.getItem('token')
 if(token){
    client.defaults.headers.common['Authorization']=token
 }
 const onSuccess=(response:AxiosResponse<T>):T=>response.data;
 const onErro=(error:any):never=>{
    throw new Error(error.reponse?.data.message||error.message)
 }
 try {
    const reponse=await client(options)
    return onSuccess(reponse)
 } catch (error) {
    return onErro(error)    
 }

 
}