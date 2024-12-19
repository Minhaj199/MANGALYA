
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alertWithOk, handleAlert } from "../../../../utils/alert/sweeAlert";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../../../../Redux/ReduxGlobal";

export const Navbar = ({ openSearchModalFunc,resetProfilePage,active }: { active: string,openSearchModalFunc?:()=>void ,resetProfilePage?:()=>void}) => {

  
  const [image, setImage] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const userphoto=useSelector((state:ReduxState)=>state.userData.photo)
  const userph=useSelector((state:ReduxState)=>state.userData.subscriptionStatus)

  useEffect(() => {
    if (userphoto) {
      setImage(userphoto || "");
    }
  }, []);
  const dispatch=useDispatch();
  const userData=useSelector((state:ReduxState)=>state.userData)
  function handleLogout() {
    setImage("");
    localStorage.removeItem('userToken');
    dispatch({type:'CLEAR_DATA'})
    handleAlert("warning", "User logged out");
    navigate("/");
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen); // Toggle menu visibility
  }
  
  function Protect(){
    if(userph&&userph==="Not subscribed "){
      alertWithOk('Subscritpion','Your are not subscribed!!! you cannot use this option',"info")
      return
    }
    navigate('/search')
  }
 
  
  return (
    <>
      <nav className="w-[99%] fixed top-4 z-[1] left-1 rounded-full right-0 h-16 flex  bg-white border shadow-md overflow-hidden">
       

        <div className="sm:w-[60%] w-[30%] flex ">
          <div className="lg:hidden w-20 h-full flex justify-center items-center">
            {/* Toggle icon with onClick handler */}
            <img
              src="./menu-bar.png"
              className="w-10 p-1 cursor-pointer"
              alt="Toggle menu"
              onClick={toggleMenu}
            />
          </div>
          
          <div className="w-[67%] lg:flex hidden py-3 sm:pl-10">
            <ul className="flex text-sm gap-5">
              <li
              onClick={()=>navigate('/loginLanding')}
                className={
                  active === "profile"
                    ? "border-b-2 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 text-dark-blue font-semibold bg-blue-300 rounded-full w-32 h-10 inline-flex justify-center items-center  font-inter"
                    : "cursor-pointer hover:bg-slate-300 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full w-32 h-10 inline-flex justify-center items-center   text-xs  font-inter"
                }
              >
                Profiles
              </li>
              {/* <li onClick={()=>navigate('/suggestion')} className={active==='suggestion'?"transform transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer   text-xs text-dark-blue font-semibold bg-blue-300 rounded-full w-32 h-10 inline-flex justify-center items-center  font-inter":" hover:bg-slate-300 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer w-32 h-10 inline-flex justify-center items-center  text-xs  font-inter"}>
                suggestion
              </li> */}
              

              <li onClick={Protect} className={active==='search'?" transform transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer font-semibold text-dark-blue w-32 h-10 inline-flex justify-center items-center bg-blue-300 rounded-full    text-xs  font-inter":" hover:bg-slate-300 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer w-32 h-10 inline-flex justify-center items-center   text-xs  font-inter"} >
                Search
              </li>
              
              <li onClick={()=>navigate('/match')} className={active==='matched'? "transform transition-transform duration-300 ease-in-out hover:scale-105   cursor-pointer  text-xs  font-inter w-32 h-10 inline-flex justify-center font-semibold text-dark-blue bg-blue-300 rounded-full items-center":" hover:bg-slate-300 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer  text-xs  font-inter w-32 h-10 inline-flex justify-center items-center"}>
                Matched Profiles
              </li>
            </ul>
          </div>
        </div>
        <div className="sm:w-[40%] w-[70%]  justify-end mr-1 flex items-center flex-row">
          {userData.subscriptionStatus&&userData.subscriptionStatus!==''&&userData.subscriptionStatus!=='subscribed'&&<button type="button" onClick={()=>navigate('/PlanDetails')} className="mr-10 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 my-2 text-center me-2 mb-2">PREMIUM</button>}
          
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
          <div className="fixed top-20 left-4 rounded-2xl w-[50%] border-l border-r border-b bg-white z-0 text-black p-4 lg:hidden">
            <ul className="flex flex-col items-start w-full h-full ">
              <li className="cursor-pointer py-2 text-sm hover:text-blue-500  " onClick={()=>(toggleMenu(),navigate('/loginLanding'))}>
                Profiles
              </li>
              <li className="hover:text-blue-500 cursor-pointer py-2 text-sm" onClick={()=>(toggleMenu(),navigate('/suggestion'))}>
                Suggestions
              </li>
              <li className="hover:text-blue-500 cursor-pointer py-2 text-sm" onClick={()=>(toggleMenu(),navigate('/search'))}>
                Search
              </li>
              <li className="hover:text-blue-500 cursor-pointer py-2 text-sm" onClick={()=>(toggleMenu(),navigate('/match'))}>
                Inbox
              </li>
            </ul>
          </div>
        )}
    </>
  );
};

