import React, {  useEffect, useState } from "react";
import { request } from "../../utils/axiosUtils";


import "./LogLanding.css";
import { Navbar } from "../Components/User/navbar/Navbar";
import { alertWithOk, handleAlert,  simplePropt } from "../../utils/alert/sweeAlert";
import { PlanData } from "../plan/Plan";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../../Redux/ReduxGlobal";
import { districtsOfKerala } from "../../App";


type profileType = { _id: string;interest:string[];photo:string;lookingFor:string; name: string; no: number,secondName:string,state
:string,age:number,gender:string,dateOfBirth:Date|string
};




export const LoginLanding = ({active}:{active:string}) => {

  
  
  
  const navigate=useNavigate()
  const [planData,setPlanData]=useState<PlanData|null>(null)
  
  
  const [requestProfile,setRequest]=useState<profileType[]>([{_id:'',age:0,gender:'',interest:[],lookingFor:'',name:'',no:0,photo:'',secondName:'',state:'',dateOfBirth:''}])
  
  ///////////////////accept request
  
  const acceptRequest=async (id:string)=>{ 
    try {
      if(planData?.name){

        const response=await request({url:'/user/manageReqRes',method:'patch',data:{id:id,action:'accept'}})
        
        if(typeof response==='object'){
          handleAlert("success",'Request accepted')
          setRequest(el=>el.filter((el)=>el._id!==id))
        }else{
          throw new Error('error on requeset')
        }
      }else{
        alertWithOk('Plan subscription','No valid plan',"info")
      }

    } catch (error:any) {
      alertWithOk('Plan insertion',error||'Error occured','error')
    }
  }

  const rejectRequest=async(id:string)=>{
    try {
      if(planData?.name){
        
        const response=await request({url:'/user/manageReqRes',method:'patch',data:{id:id,action:'reject'}})
        
        if(typeof response==='object'){
          handleAlert("warning",'Request rejected')
          setRequest(el=>el.filter((el)=>el._id!==id))
        }else{
          throw new Error('error on requeset')
        }
      }else{
        alertWithOk('Plan subscription','No valid plan',"info")
      }

    } catch (error:any) {
      alertWithOk('Plan insertion',error||'Error occured','error')
    }
  }
  
  


///////////handle matching
const dispatch=useDispatch()
 
const handleMatch=async(id:string)=>{
  
  if(planData){
    if(planData.avialbleConnect&&planData.avialbleConnect>0){
     
      try {    
        const response:boolean= await request({url:'/user/addMatch',method:'post',data:{matchId:id}})  
        if(response===true){
          setPlanData(el=>{
            if(!el)return null
            return {...el,avialbleConnect:el.avialbleConnect?el.avialbleConnect-1:el.amount}
          })
          setProfiles(el=>(el?.filter((element)=>element._id!==id)))
        }
      } catch (error) {
        
      }
    }else{
      dispatch({type:'SET_DATA',payload:{...useData,subscriptionStatus:'connection finished'}})
      alertWithOk('Plan subscription','You connection count finished please subscribe',"info")
      simplePropt(()=>navigate('/PlanDetails'),'Do you want purchase new Plan')
    }
  }else{
    alertWithOk('Plan subscription','No valid plan',"info")
  }
}
  const [profils, setProfiles] = useState<profileType[]>([]);
  const useData=useSelector((state:ReduxState)=>state.userData) 
  ////////pagination
 
  
  
  const [interest,setInterest]=useState<string[]>()
  //////////profile and plan fetching///////
  useEffect(() => {
    async function fetch() { 
      const response: {datas:profileType[],currntPlan:PlanData,interest:string[]} = await request({
        url: `/user/fetchProfile`,
      })
      setInterest(response.interest)
      
      const res:any = response.datas??{profile:[],request:[]} ;
     
      if(res[0]?.profile)
      
      setProfiles(res[0].profile);
    if(res[0]?.request)
      
      setRequest(res[0]?.request)
    if(response.currntPlan&&typeof response.currntPlan==='object'&&Object.keys(response.currntPlan).length){
      setPlanData(response.currntPlan)
    }
    }   
    fetch();
}, []);

/////////////pagination
const [totalPage,setTotalPage]=useState(0)
const itemPerPage=5
const [currentPage,setCurrenPage]=useState(1)
const [currentData,setCurrentData]=useState<profileType[]|undefined>([])



//////////scroll pagination
const handlePreviouse=()=>{
  window.scrollTo({top:0,behavior:'smooth'})
    if(currentPage>1)setCurrenPage(el=>el-1)
}
const handleNext=()=>{
  
  window.scrollTo({top:0,behavior:'smooth'})   
  if(currentPage<totalPage)setCurrenPage(el=>el+1)
  }
///////search////////////
const [openSearch,setOpenSearch]=useState<boolean>(false)
const [searchData,setSearchData]=useState<{minAge:number,maxAge:number,district:string,interest:string[]}>({minAge:18,maxAge:60,district:'',interest:[]})
let minAge:number[]=[]
for(let i=18;i<60;i++){
  minAge.push(i)
}
let maxAge:number[]=[]
for(let i=19;i<61;i++){
  maxAge.push(i)
}
function openSearchModalFunc(){
  setOpenSearch(true)
}
async function  resetProfilePage(){
  const response: {datas:profileType[],currntPlan:PlanData,interest:string[],massage:string} = await request({
    url: `/user/fetchProfile`,
  })
  if(response.massage){
    localStorage.removeItem('id')
  }
const res:any = response.datas??{profile:[],request:[]} ;
  if(res[0]?.profile)  
  setProfiles(res[0].profile);
}
function handleInterest(e:React.ChangeEvent<HTMLSelectElement>){
  if(!searchData.interest.includes(e.target.value)&&e.target.value!==''){
    setSearchData(el=>({...el,interest:[...el.interest,e.target.value]}))
  }
}
    function handleClose(e:React.MouseEvent<HTMLDivElement>){
      if(e.target===e.currentTarget){
        setSearchData({minAge:18,maxAge:60,district:'',interest:[]})
        setOpenSearch(false)

      }
    }
    function handleChild(e:React.MouseEvent<HTMLDivElement>):void{
      e.stopPropagation()
    }
    function removeInterest(index:number){
      if(interest){
        setSearchData(el=>({...el,interest:el.interest.filter(el=>el!==searchData.interest[index])}))
      }
    }
  async  function handleSearch(){
    if(searchData.maxAge<searchData.minAge){
      alertWithOk('Search Details','Please provide a valid age range',"warning")
      return
    }
    const response: {datas:profileType[],currntPlan:PlanData,interest:string[]} = await request({
      url: `/user/fetchProfile`,
    })
  const res:any = response.datas??{profile:[],request:[]} ;
    if(res[0]?.profile)  
    setProfiles(res[0].profile);
    if(searchData.district&&searchData.interest.length!==0){
      const profile=profils.filter(el=>{
        return (searchData.minAge<=el.age&&searchData.maxAge>=el.age&&el.state===searchData.district&&el.state&&searchData.interest.every(interest=>el.interest.includes(interest)))
     })
     if(!profile.length){
      alertWithOk('search result','no result found',"warning")
      return
     }
     setProfiles(profile)  
      
    }
    else if(!searchData.district&&searchData.interest.length===0){
      
        const profile=profils.filter(el=>{
              return (searchData.minAge<=el.age&&searchData.maxAge>=el.age)
           })
           if(!profile.length){
            alertWithOk('search result','no result found',"warning")
            return
           }
           setProfiles(profile)  
      
            
      }else if(searchData.district){
        const profile=profils.filter(el=>{
           return (searchData.minAge<=el.age&&searchData.maxAge>=el.age&&searchData.district===el.state)
        })     
        if(!profile.length){
          alertWithOk('search result','no result found',"warning")
          return
         }
         setProfiles(profile)
        
        
      }else if(searchData.interest.length!==0){
        const profile=profils.filter(el=>{
          return (searchData.minAge<=el.age&&searchData.maxAge>=el.age&&searchData.interest.every(interest=>el.interest.includes(interest)))
        })   
        if(!profile.length){
          alertWithOk('search result','no result found',"warning")
          return
         }
         setProfiles(profile)
        
      }
      
     
      setSearchData({minAge:18,maxAge:60,district:'',interest:[]})
      setOpenSearch(false)
    }
  //   useEffect(() => {
  //     setCurrenPage(1);
  // }, [profils]);
  
    useEffect(() => {
      if (profils?.length) {
          const total = Math.ceil(profils.length / itemPerPage);
          setTotalPage(total);
          if (currentPage > total) {
              setCurrenPage(total);
          } else {
              const sliceData = profils.slice(
                  (currentPage - 1) * itemPerPage,
                  currentPage * itemPerPage
              );
              setCurrentData(sliceData);
          }
      } else {
        console.log(typeof profils[0]?.age)
          setTotalPage(0);
          setCurrentData([]); 
      }
  }, [profils, currentPage, itemPerPage]);
  
  return (
    <div className="h-[1800px] w-[100%] bg-gray-400 ">
      {openSearch&&
      <div onClick={(e)=>handleClose(e)} className="w-full h-full  flex justify-center items-center fixed  z-10">
      <div onClick={(e)=>handleChild(e)} className="sm:w-[40%] sm:h-[80%] w-[80%] h-[70%] bg-theme-blue rounded-3xl">
        <div className="w-full h-[20%] flex justify-center items-center">
          <p className="text-white text-2xl font-popin">SEARCH</p>
        </div>
        <div className=" items-center w-full h-[60%]   flex-col flex justify-evenly ">
          <div className="w-[70%]  flex  text-white font-medium font-popin h-[15%] ">
          <div className="w-[60%] flex items-center">
          <p className="font-bold">Age</p>
          </div>
          <div className="w-[40%]  flex justify-evenly items-center">
          <select value={searchData.minAge} onChange={(t)=>setSearchData(el=>({...el,minAge:parseInt(t.target.value)}))} className=" outline-none h-10 w-10 text-gray-600" name="" id="">
            {minAge.map((el,index)=><option key={index}>{el}</option>)}
          </select>       
          <p className="">TO</p>
          <select value={searchData.maxAge} onChange={(t)=>setSearchData(el=>({...el,maxAge:parseInt(t.target.value)}))} className=" outline-none h-10 w-10 text-gray-600" >
            {maxAge.map((el,index)=><option key={index}>{el}</option>)}
          </select>
         
          </div>
          
          </div>
          <div className="w-[70%]   flex  text-white font-medium font-popin h-[15%] ">
          <div className="w-[40%] flex items-center">
          <p className="font-bold">District</p>
          </div>
          <div className="w-[60%]  flex justify-end items-center">

          <select  onChange={(t)=>setSearchData(el=>({...el,district:t.target.value}))} className="text-slate-700 outline-none h-8"  name="" id="">
            <option value='' >District</option>
            {districtsOfKerala.map((el,index)=>(<option  key={index}>{el}</option>))}
          </select>
          </div>
          
          </div>
          <div className="w-[70%]  flex  text-white font-medium font-popin h-[15%] ">
          <div className="w-[40%] flex items-center">
          <p className="font-bold">Interest</p>
          </div>
          <div className="w-[60%]  flex justify-end items-center">
          <select disabled={(searchData.interest?.length===3)?true:false}  onChange={(t)=>handleInterest(t)} className="text-slate-700 outline-none w-[75%] h-8"   name="" id="">
            <option value=''  >Interest</option>
            {interest?.map((el,index)=>(<option  key={index}>{el}</option>))}
          </select>
          </div>
          </div>
          <div className="w-[70%] p-3 h-[38%] bg-white grid grid-cols-2 ">
            {searchData.interest.map((el,index)=>
              <div key={index} className="sm:w-32 sm:text-base w-18 text-sm h-8 inline-flex justify-center items-center rounded-full boreder border">
                <p>
                {el}
                </p>
                <img src="/minus-button.png" onClick={()=>removeInterest(index)} className="ml-2 cursor-pointer" width={15} height={15} alt="" />
                </div>
            )}
            
          </div>
        </div>
        <div className="w-full h-[15%] flex justify-center items-center ">
          <button onClick={()=>handleSearch()} className="outline-none border-2 border-white text-white h-12 font-bold rounded-lg w-44">SEARCH</button>
        </div>
      </div>
      </div>
      }
      <Navbar active={active} openSearchModalFunc={openSearchModalFunc} resetProfilePage={resetProfilePage}/>
      <div className="w-[100%] h-full mt-2  flex">
        <div className="sm:w-[20%] w-[40%] h-[40%] mt-11">
       
          <div className="w-full h-[30%]  flex justify-center items-center">
           {planData?.name?
           <div className="w-[95%] h-[85%] bg-dark-blue  rounded-3xl ">
              <div className="w-full h-[30%] flex justify-center items-center">
                {" "}
                <p className="font-aborato font-black text-2xl text-gray-200 ">
                 {planData.name}
                </p>
              </div>
              <div className="w-full h-[40%] flex items-center pl-3   ">

              </div>
              <div className="w-full h-[30%]  flex justify-center items-center">
                <div className="w-44 h-9 bg-slate-300 flex justify-center items-center">
                  <p>connection left :{planData.avialbleConnect}/{planData.connect}</p>
                </div>
              </div>
            </div>
            
            :
            <div className="w-[95%] h-[85%] bg-dark-blue flex justify-center items-center  rounded-3xl ">
            <h1 className="font-bold text-white">PLAN NOT AVAILABLE</h1>
          </div>
            
            }
      
          </div>
          <div className="w-full h-[70%] rounded-full flex justify-center items-center ">
            <div className="w-[95%] h-[100%] bg-dark-blue rounded-3xl   ">
              <div className="w-full h-[20%] flex justify-center  ">
                {" "}
                <p className="font-mono font-black text-2xl text-gray-200 mt-2 ">
                  REQUEST
                </p>
              </div>
              <div
                id="request"
                className="w-full h-[80%]   bg-dark-blue "
              >
                {requestProfile?.map((el,index)=>{

                  return(
                    <div className="w-full h-16 mt-3 bg-theme-blue flex" key={index}>
                  <div className="w-[70%] h-full  py-2 px-2 flex ">
                    <div className="w-12 h-12 bg-slate-500 rounded-full">
                      <img src={el.photo?el.photo:'/adminLogin_.png'} className="w-full h-full rounded-full" alt="" />
                    </div>
                    <p className="font-popin px-6 py-2">{el.name}</p>
                  </div>
                  <div className="w-[30%] h-full flex justify-center items-center">
                    <div className="w-5 h-5 mr-2">
                      <img 
                      onClick={()=>acceptRequest(el._id)}
                        src="/checked.png"
                        className="w-full cursor-pointer h-full "
                        alt=""
                      />
                    </div>
                    <div className="w-5 h-5 cursor-pointer mr-2">
                      <img onClick={()=>rejectRequest(el._id)} src="/remove.png" className="w-full h-full" alt="" />
                    </div>
                  </div>
                </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-[75%] w-[60%] h-full   ">
          {currentData?.map((el) => {
            return (
              <div
                className="w-[90%] sm:w-[80%] sm:h-[15%] h-[8%] bg-white sm:mx-14 mx-6 my-16 flex"
                key={el.no}
              >
                <div className="w-[30%] h-full flex justify-center items-center">
                  <div className="w-[90%] h-[90%] ">
                   <img
                      className="h-full w-full "
                      src={el.photo?el.photo: "/defualtImage.jpg"}
                      alt=""
                    />
                  </div>
                </div>
                <div className="w-[70%] h-full flex  items-center  ">
                  <div className="w-[98%] border border-gray-400  items-center flex-col h-[90%] bg-white flex justify-between">
                    <div className="w-4/5 h-[18%] border-b  border-gray-300 flex justify-center items-center ">
                      <p className="font-inter">{el.name} {el.secondName}</p>
                    </div>
                    <div className="w-full h-[64%]   flex justify-center items-center  ">
                      <div className="w-1/2 h-[99%] border-l  border-gray-300 ">
                      <div className="w-full h-[23%] flex items-center text-gray-600 justify-between px-2 mt-1 ">
                        <p className="sm:text-base text-[10px]">Looking for: </p>
                        <p className="sm:text-base text-[10px]">{el.lookingFor}</p>
                      </div>
                      <div className="w-full h-[23%] flex items-center text-gray-600 justify-between px-2 mt-1 ">
                        <p className="sm:text-base text-[10px]">Age </p>
                        <p className="sm:text-base text-[10px]">{el.age}</p>
                      </div>
                      <div className="w-full h-[23%] flex items-center text-gray-600 justify-between px-2 mt-1 ">
                        <p className="sm:text-base text-[10px]">Gender</p>
                        <p className="sm:text-base text-[10px]">{el.gender}</p>
                      </div>
                      <div className="w-full h-[23%] flex items-center text-gray-600 justify-between px-2 mt-1 ">
                        <p className="sm:text-base text-[10px]">state </p>
                        <p className="sm:text-base text-[10px]">{el.state}</p>
                      </div>
                      </div>
                      <div className="w-1/2 h-[99%] border-l border-gray-300 ">
                      {el.interest?.length?<p className="pl-2 text-gray-600 sm:text-base text-[11px]">Interest</p>:<></>}
                      <ul className="sm:px-2 px-1 sm:pt-3 text-gray-600 grid grid-cols-2">
                       {el.interest?.map((element,index)=>( <li className="sm:pt-2 pt-1 sm:text-base text-[10px]" key={index}>{element}</li>))}
                      </ul>
                      </div>
                    </div>
                    <div className="w-full h-[18%]   flex justify-end items-center  ">
                      <img onClick={()=>handleMatch(el._id)} src="/check.png" className="sm:w-7 sm:h-7 w-4 h-4  mr-3 cursor-pointer" alt="" />
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
           <div className="w-[80%] h-14 flex justify-center text-center">
            <p className="mt-4 mr-1"><span className="font-bold">{currentPage}</span> of {totalPage} </p>
           <button onClick={()=>handlePreviouse()} disabled={currentPage === 1}  className="bg-dark_red text-white rounded-full h-14 w-14" >{'<<'}</button>
           <button onClick={()=>handleNext()} disabled={currentPage === totalPage}  className="bg-dark_red text-white rounded-full h-14 w-14 ml-1 font-bold ">{'>>'}</button>
           </div>
        </div>
        
      </div>
      {/* <Footer/> */}
     
    </div>
  );
};
