import { useEffect, useState } from "react";
import { request } from "../../utils/axiosUtils";


import "./LogLanding.css";
import { Navbar } from "../Components/User/navbar/Navbar";
import { Footer } from "../Components/User/Footer/Footer";
import { alertWithOk, handleAlert } from "../../utils/alert/sweeAlert";

type profileType = { _id: string;interest:string[];photo:string;lookingFor:string; name: string; no: number,secondName:string,state
:string,age:number,gender:string
};



export const LoginLanding = ({active}:{active:string}) => {
  useEffect(()=>{

  })
  const [requestProfile,setRequest]=useState<profileType[]>([{_id:'',age:0,gender:'',interest:[],lookingFor:'',name:'',no:0,photo:'',secondName:'',state:''}])
  const acceptRequest=async (id:string)=>{ 
    try {
      const response=await request({url:'/user/manageReqRes',method:'patch',data:{id:id,action:'accept',userId:localStorage.getItem('id')}})
      
      if(typeof response==='object'){
        handleAlert("success",'Request accepted')
        setRequest(el=>el.filter((el)=>el._id!==id))
      }else{
        throw new Error('error on requeset')
      }

    } catch (error:any) {
      alertWithOk('Plan insertion',error||'Error occured','error')
    }
  }
  const rejectRequest=async(id:string)=>{
    try {
      const response=await request({url:'/user/manageReqRes',method:'patch',data:{id:id,action:'reject',userId:localStorage.getItem('id')}})
      
      if(typeof response==='object'){
        handleAlert("warning",'Request rejected')
        setRequest(el=>el.filter((el)=>el._id!==id))
      }else{
        throw new Error('error on requeset')
      }

    } catch (error:any) {
      alertWithOk('Plan insertion',error||'Error occured','error')
    }
  }
  
  const userId=localStorage.getItem('id')

const handleMatch=async(id:string)=>{
  try {
    
    const response:boolean= await request({url:'/user/addMatch',method:'post',data:{matchId:id,userId:userId}})
   
    
    if(response===true){
      setProfiles(el=>(el?.filter((element)=>element._id!==id)))
    }
  } catch (error) {
    
  }
}
  const [profils, setProfiles] = useState<profileType[]>();
  useEffect(()=>{
      if(profils?.length&&profils.length>1){
          setTotalPage(Math.ceil(  profils.length?profils?.length/5:1))
      }
  },[profils])
  
  useEffect(() => {
    async function fetch() { 
      const preferedGender=localStorage.getItem('partner')
       const gender=localStorage.getItem('gender')
       const id=localStorage.getItem('id')
      const response: profileType[] = await request({
        url: `/user/fetchProfile?preferedGender=${preferedGender}&gender=${gender}&id=${id}`,
      })
      const res:any = response  ??{profile:[],request:[]} ;
     
      if(res[0]?.profile)
      setProfiles(res[0].profile);
    if(res[0]?.request)
      setRequest(res[0]?.request)
    }
    
    fetch();
}, []);

const [totalPage,setTotalPage]=useState(0)

const itemPerPage=5
const [currentPage,setCurrenPage]=useState(1)

const   currentData=profils?.slice(
    (currentPage-1)*itemPerPage,
    currentPage*itemPerPage
)

const handlePreviouse=()=>{
  window.scrollTo({top:0,behavior:'smooth'})
    if(currentPage>1)setCurrenPage(el=>el-1)
}
const handleNext=()=>{
   
  window.scrollTo({top:0,behavior:'smooth'})   
    if(currentPage<totalPage)setCurrenPage(el=>el+1)
    }
 
  return (
    <div className="h-[1800px] w-[100%] bg-gray-400 ">
      <Navbar active={active}/>
      <div className="w-screen h-full mt-14  flex">
        <div className="sm:w-[25%] w-[40%] h-[50%] mt-11   ">
       
          <div className="w-full h-[30%]  flex justify-center items-center">
            <div className="w-[95%] h-[85%] bg-dark_red  rounded-3xl ">
              <div className="w-full h-[30%] flex justify-center items-center">
                {" "}
                <p className="font-aborato font-black text-2xl text-gray-200 ">
                  Gold
                </p>
              </div>
              <div className="w-full h-[40%] flex items-center pl-3   ">
                <p className="font-medium text-white">Expiry:20/12/2024</p>
              </div>
              <div className="w-full h-[30%]  flex justify-center items-center">
                <div className="w-44 h-9 bg-slate-300 flex justify-center items-center">
                  <p>connection left :30/60</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[70%] rounded-full flex justify-center items-center ">
            <div className="w-[95%] h-[100%] bg-dark_red rounded-3xl   ">
              <div className="w-full h-[20%] flex justify-center  ">
                {" "}
                <p className="font-mono font-black text-2xl text-gray-200 mt-2 ">
                  REQUEST
                </p>
              </div>
              <div
                id="request"
                className="w-full h-[80%]   bg-dark_red "
              >
                {requestProfile?.map((el,index)=>{

                  return(
                    <div className="w-full h-16 mt-3 bg-[#e37171] flex" key={index}>
                  <div className="w-[70%] h-full  py-2 px-2 flex ">
                    <div className="w-12 h-12 bg-slate-500 rounded-full">
                      <img src={el.photo?el.photo:'/adminLogin_.png'} className="w-full h-full rounded-full" alt="" />
                    </div>
                    <p className="font-popin px-6 py-2">{el.name} {el.secondName}</p>
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
                      {el.interest.length?<p className="pl-2 text-gray-600 sm:text-base text-[11px]">Interest</p>:<></>}
                      <ul className="sm:px-2 px-1 sm:pt-3 text-gray-600 grid grid-cols-2">
                       {el.interest.map((element,index)=>( <li className="sm:pt-2 pt-1 sm:text-base text-[10px]" key={index}>{element}</li>))}
                       
                       
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
