
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alertWithOk, handleAlert } from "../../../../utils/alert/sweeAlert";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../../../../Redux/ReduxGlobal";
import { useSocket } from "@/globalSocket";
import { request } from "@/utils/axiosUtils";




export const Navbar = ({ openSearchModalFunc,resetProfilePage,active }: { active: string,openSearchModalFunc?:()=>void ,resetProfilePage?:()=>void}) => {

  const socket=useSocket()

  const [image, setImage] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const userphoto=useSelector((state:ReduxState)=>state.userData.photo)
  
  const [messageNumber,setMessageNumber]=useState(0)
  const [ids,setIds]=useState<string[]>()
  
  const [shouldNavigate, setShouldNavigate] = useState(false);
  useEffect(() => {
    if (userphoto) {
      setImage(userphoto || "");
    }

    const fetchMessage=async()=>{
      const fetch:{count:number,ids:string[]}=await request({url:'/user/countMessages?from=nav'})
  
      setMessageNumber(fetch.count)
      if(fetch.ids&&fetch.ids.length>0){
        setIds(fetch.ids)
      }
    }
    fetchMessage()
  },[]);
  useEffect(()=>{
    socket?.on('addMessageCount',data=>{
      if(data?.id){

        setIds(el=>(el?[...el,data.id]:[data.id]))
      }
      setMessageNumber(el=>el+1)
    })

    return ()=>{
      socket?.off('addMessageCount')
    }
  },[socket])
  const dispatch=useDispatch();
  const userData=useSelector((state:ReduxState)=>state.userData)

 
  function handleLogout() {
    setImage("");
    if(socket)
    socket.emit('userLoggedOut',{id:localStorage.getItem('userToken')})
    localStorage.removeItem('userToken');
    dispatch({type:'CLEAR_DATA'})
    handleAlert("warning", "User logged out");
    navigate("/");
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }
  
  async function Protect(){
    if(userData?.subscriptionStatus&&userData.subscriptionStatus==="Not subscribed"){
      alertWithOk('Subscritpion','Your are not subscribed!!! you cannot use this option',"info")
      return
    }
    
    navigate('/search',{state:{from:'search'}})
  }
  function ProtectSuggestion(){
    if(userData?.subscriptionStatus&&userData.subscriptionStatus==="Not subscribed"){
      alertWithOk('Subscritpion','Your are not subscribed!!! you cannot use this option',"info")
      return
    }
    navigate('/suggestion',{state:{from:'suggestion'}})
  }
  useEffect(()=>{
   
    if(shouldNavigate&&messageNumber===0){
      setShouldNavigate(false)
      navigate('/match')
    }
  },[shouldNavigate,messageNumber])
  async function handleMatchProfile(){
    try {
      const response:{status:boolean}= await request({url:'/user/messageReaded',data:{ids:ids,from:'nav'},method:'patch'})
      console.log(response)
      if(response.status){
        setMessageNumber(0)
        setIds([])
        setShouldNavigate(true)
      }
    } catch (error) {
      return false
    }
  
  
   }
  
  return (
    <>
      <nav className="w-[99%] fixed top-4 z-[1] left-1 rounded-full right-0 h-16 flex  bg-white border shadow-md overflow-hidden">
       

        <div className="sm:w-[60%] w-[30%] flex ">
          <div className="lg:hidden relative w-20 h-full flex justify-center items-center">
            {/* Toggle icon with onClick handler */}
            <img
              src="./menu-bar.png"
              className="w-10 p-1 cursor-pointer"
              alt="Toggle menu"
              onClick={toggleMenu}
            />
             {(messageNumber>=1)&&<div className="w-6 h-6 text-xs rounded-full right-0 top-0 bg-yellow-600 absolute inline-flex justify-center items-center font-bold text-white">{(messageNumber>10)?'10+':messageNumber}</div>}
          </div>
          
          <div className="w-[67%] lg:flex hidden py-3 sm:pl-10">
            <ul className="flex text-sm gap-5">
              <li
              onClick={()=>navigate('/loginLanding',{state:{from:'profile'}})}
                className={
                  active === "profile"
                    ? "border-b-2 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 text-dark-blue font-semibold bg-blue-300 rounded-full w-32 h-10 inline-flex justify-center items-center  font-inter"
                    : "bg-slate-300  rounded-full cursor-pointer hover:bg-slate-300 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full w-32 h-10 inline-flex justify-center items-center   text-xs  font-inter"
                }
              >
                Profiles
              </li>
              <li onClick={ProtectSuggestion} className={active==='suggestion'?"transform transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer   text-xs text-dark-blue font-semibold bg-blue-300 rounded-full w-32 h-10 inline-flex justify-center items-center  font-inter":" bg-slate-300  rounded-full hover:bg-slate-400 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer w-32 h-10 inline-flex justify-center items-center  text-xs  font-inter"}>
                suggestion
              </li>
              

              <li onClick={Protect} className={active==='search'?" transform transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer font-semibold text-dark-blue w-32 h-10 inline-flex justify-center items-center bg-blue-300 rounded-full    text-xs  font-inter":"bg-slate-300  rounded-full hover:bg-slate-400 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer w-32 h-10 inline-flex justify-center items-center   text-xs  font-inter"} >
                Search
              </li>
              
              <li onClick={handleMatchProfile} className={active==='matched'? "transform relative transition-transform duration-300 ease-in-out hover:scale-105   cursor-pointer  text-xs  font-inter w-32 h-10 inline-flex justify-center font-semibold text-dark-blue bg-blue-300 rounded-full items-center":" bg-slate-300   rounded-full hover:bg-slate-400 relative transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer  text-xs  font-inter w-32 h-10 inline-flex justify-center items-center"}>
                Matched Profiles
             {(messageNumber>=1)&&<div className="w-6 h-6 text-xs rounded-full -right-2 -top-1 bg-yellow-600 absolute inline-flex justify-center items-center font-bold text-white">{(messageNumber>10)?'10+':messageNumber}</div>}
              </li>
            </ul>
          </div>
        </div>
        <div className="sm:w-[40%] w-[70%]   justify-end mr-1 flex items-center flex-row">
          
          {userData.subscriptionStatus&&userData.subscriptionStatus!==''&&userData.subscriptionStatus!=='subscribed'&&<button type="button" onClick={()=>navigate('/PlanDetails')} className="mr-10 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 my-2 text-center me-2 mb-2">PREMIUM</button>}
          {/* <div className="w-10 h-10 mx-5">
            <img src="/email.png" className="w-full  h-full" alt="" />
          </div> */}
          <p
            className="transform transition-transform duration-300 ease-in-out hover:scale-105 font-aborato font-extrabold mr-1 text-xs  cursor-pointer sm:mb-0"
            onClick={handleLogout}
          >
            LOG OUT
          </p>
          <div  className=" sm:w-12 sm:h-12 w-10 h-10 rounded-[50%]">
            <img onClick={()=>navigate('/userProfile')}
              src={image ? image : "/profile.png"}
              className=" cursor-pointer rounded-full w-full h-full"
              alt="Profile"
            />
          </div>
        </div>
       
        
        
      </nav>
      {menuOpen && (
          <div className="fixed top-20  left-4 rounded-2xl w-[50%] border-l border-r border-b bg-gray-400 z-[1] text-black p-4 lg:hidden">
            <ul className="flex flex-col items-start w-full h-full  ">
              <li className="cursor-pointer py-2 text-sm hover:text-blue-500  " onClick={()=>(toggleMenu(),navigate('/loginLanding'))}>
                Profiles
              </li>
              <li className="hover:text-blue-500 cursor-pointer py-2 text-sm" onClick={()=>(toggleMenu(),navigate('/suggestion'))}>
                Suggestions
              </li>
              <li className="hover:text-blue-500 cursor-pointer py-2 text-sm" onClick={()=>(toggleMenu(),navigate('/search'))}>
                Search
              </li>


              <li className="hover:text-blue-500 cursor-pointer py-2 text-sm inline-flex" onClick={()=>(toggleMenu(),handleMatchProfile())}>
              Matched Profiles
              
              </li>
              
            </ul>
          </div>
        )}
    </>
  );
};

