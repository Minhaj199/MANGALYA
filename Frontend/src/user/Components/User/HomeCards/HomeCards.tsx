import { useEffect, useState } from "react"
import { request } from "../../../../utils/axiosUtils"

export const Search = () => {
 type newAddedData={name:string,age:number,image:string,place:string}
  const [fetchedData,setFetechedData]=useState<newAddedData[]>([{name:'',age:0,image:'',place:''}])
  useEffect(()=>{
    const fetchNewAdded=async()=>{
      const data:newAddedData[]=await request({url:'/user/fetchforLanding'})
      console.log(data)
      setFetechedData(data)
    }
    fetchNewAdded()
  },[])
    
  return (
    <>
    <div className="w-screen  h-[100px] bg-white flex justify-center items-center">
          <p className="text-base sm:text-xl lg:text-3xl text-[#0b3e80] fin font-aborato">
          Last Added Profiles
          </p>
    </div>
        <div  className="px-10 py-10 bg-center grid grid-cols-1  md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-4 gap-10  ">
        {fetchedData.map((el,index)=><div key={index} className="w-[250px] h-[300px] hover:shadow-3xl bg-[#007bff] p-1">
          <div className="w-[100%] h-[80%] border border-white bg-slate-500">
            <img className="w-full h-full" src={(el.image!=='')?el.image:'./defualtImage.jpg'} alt="" />
            
          </div>
          <p className="pt-2 bl-2 text-white font-popin font-semibold">{el.name}</p>
          <p className=" text-sm text-white">{el.age} years age {el.place}</p>
         </div>)}
        
         
         
       </div>
      
    </>
  )
}
