// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { handleAlert } from "../../../../utils/alert/sweeAlert";

// export const Navbar = ({ active }: { active: string }) => {
//   const [image, setImage] = useState<string>("");
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (localStorage.getItem("photo")) {
//       setImage(localStorage.getItem("photo") || "");
//     }
//   });
//   const activeForHome =
//     " border-b-2 cursor-pointer   border-white text-sm  text-white font-inter";
//   function handleLogout() {
//     setImage("");
//     localStorage.clear();
//     handleAlert("warning", "user loged out");
//     navigate("/");
//   }
//   useEffect(() => {}, []);
//   return (
//     <>
    
//     <nav className="w-[100%] fixed top-0 left-0 right-0 h-16 flex bg-dark-blue  overflow-hidden">
//       <div className="sm:w-[80%] w-[50%] flex ">
//         <div className="sm:hidden w-20 h-full flex justify-center items-center">
//           <img src="./menu-bar.png" className="w-10 p-1 cursor-pointer" alt="" />
//         </div>
//         <div className="sm:flex hidden w-[13%] h-full  sm:items-center items-start ">
//           <div>
//             <img
//               className="md:w-22 md:h-10  ml-1 h-full w-full   cursor-pointer"
//               src="/png/logo-no-background.png   "
//               alt=""
//             />
//           </div>
//         </div>
//         <div className="w-[67%]  sm:flex hidden py-5 sm:pl-10">
//           <ul className=" flex text-sm">
//             <li
//               className={
//                 active === "profile"
//                   ? activeForHome
//                   : " cursor-pointer sm:pl-4 pl-2 text-sm   text-white font-inter"
//               }
//             >
//               Profiles
//             </li>
//             <li className="cursor-pointer sm:pl-4 pl-2 text-xs text-white font-inter">
//               Suggesetions
//             </li>
//             <li className="cursor-pointer sm:pl-4 pl-2 text-xs  text-white font-inter">
//               Search
//             </li>
//             <li className="cursor-pointer sm:pl-4 pl-2 text-xs text-white font-inter">
//               Inbox
//             </li>
//           </ul>
//         </div>
//       </div>
//       <div className="sm:w-[20%] w-[50%]  justify-end mr-1 flex items-center flex-row">
//         <p
//           className="font-aborato font-extrabold mr-1  text-xs text-white cursor-pointer  sm:mb-0"
//           onClick={handleLogout}
//         >
//           LOG OUT
//         </p>
//         <div className="sm:w-12 sm:h-12 w-10 h-10 rounded-[50%] ">
//           <img
//             src={image ? image : "/profile.png"}
//             className="rounded-full w-full h-full"
//             alt=""
//           />
//         </div>
//       </div>
//       <div></div>
//     </nav>
//     </>
//   );
// };
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleAlert } from "../../../../utils/alert/sweeAlert";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../../../../Redux/ReduxGlobal";

export const Navbar = ({ active }: { active: string }) => {
  const [image, setImage] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const userphoto=useSelector((state:ReduxState)=>state.userData.photo)
  
  useEffect(() => {
    if (userphoto) {
      setImage(userphoto || "");
    }
  }, []);
  const dispatch=useDispatch()
  const activeForHome =
    "border-b-2 cursor-pointer border-white text-sm text-white font-inter";

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
  

  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 h-16 flex  bg-dark-blue overflow-hidden">
        <div className="sm:w-[60%] w-[30%] flex">
          <div className="sm:hidden w-20 h-full flex justify-center items-center">
            {/* Toggle icon with onClick handler */}
            <img
              src="./menu-bar.png"
              className="w-10 p-1 cursor-pointer"
              alt="Toggle menu"
              onClick={toggleMenu}
            />
          </div>
          <div className="sm:flex hidden w-[13%] h-full sm:items-center items-start">
            <div>
              <img
                className="md:w-22 md:h-10 ml-1 h-full w-full cursor-pointer"
                src="/png/logo-no-background.png"
                alt="Logo"
              />
            </div>
          </div>
          <div className="w-[67%] sm:flex hidden py-5 sm:pl-10">
            <ul className="flex text-sm">
              <li
                className={
                  active === "profile"
                    ? activeForHome
                    : "cursor-pointer sm:pl-4 pl-2 text-sm text-white font-inter"
                }
              >
                Profiles
              </li>
              <li className="cursor-pointer sm:pl-4 pl-2 text-xs text-white font-inter">
                Suggestions
              </li>
              <li className="cursor-pointer sm:pl-4 pl-2 text-xs text-white font-inter">
                Search
              </li>
              <li className="cursor-pointer sm:pl-4 pl-2 text-xs text-white font-inter">
                Inbox
              </li>
            </ul>
          </div>
        </div>
        <div className="sm:w-[40%] w-[70%]  justify-end mr-1 flex items-center flex-row">
          {localStorage.getItem('subscriptionStatus')&&localStorage.getItem('subscriptionStatus')!=='subscribed'&&<button type="button" onClick={()=>navigate('/PlanDetails')} className="mr-10 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 my-2 text-center me-2 mb-2">PREMIUM</button>}
          
          <p
            className="font-aborato font-extrabold mr-1 text-xs text-white cursor-pointer sm:mb-0"
            onClick={handleLogout}
          >
            LOG OUT
          </p>
          <div className="sm:w-12 sm:h-12 w-10 h-10 rounded-[50%]">
            <img
              src={image ? image : "/profile.png"}
              className="rounded-full w-full h-full"
              alt="Profile"
            />
          </div>
        </div>
        {/* Conditionally render the menu based on menuOpen state */}
        
      </nav>
      {menuOpen && (
          <div className="fixed top-16 left-0 w-[50%]  bg-dark-blue z-0 text-white p-4 sm:hidden">
            <ul className="flex flex-col items-start w-full h-full ">
              <li className="cursor-pointer py-2 text-sm " onClick={toggleMenu}>
                Profiles
              </li>
              <li className="cursor-pointer py-2 text-sm" onClick={toggleMenu}>
                Suggestions
              </li>
              <li className="cursor-pointer py-2 text-sm" onClick={toggleMenu}>
                Search
              </li>
              <li className="cursor-pointer py-2 text-sm" onClick={toggleMenu}>
                Inbox
              </li>
            </ul>
          </div>
        )}
    </>
  );
};

