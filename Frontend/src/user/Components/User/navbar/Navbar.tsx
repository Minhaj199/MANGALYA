import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleAlert } from '../../../../utils/alert/sweeAlert';

export const Navbar = ({active}:{active:string}) => {
    const [image, setImage] = useState<string>("");
    const navigate = useNavigate();
    useEffect(()=>{
        if (localStorage.getItem("photo")) {
            setImage(localStorage.getItem("photo") || "");
          }
    },)
    const activeForHome=' border-b-2 cursor-pointer   border-white text-sm sm:text-base text-white font-inter'
    function handleLogout() {
        setImage("");
        localStorage.clear()
        handleAlert("warning", "user loged out");
        navigate("/");
      }
      
  return (
    <nav className="w-full fixed top-0 left-0 right-0 h-24 flex bg-dark_red">
        <div className="w-1/6 h-full flex sm:items-center items-start">
          <img
            className="md:w-18 md:h-16 ml-1   cursor-pointer"
            src="/png/logo-no-background.png "
            alt=""
          />
        </div>
        <div className="lg:w-4/6 h-full md:w-3/6   flex py-9 sm:pl-10   ">
          <ul className=" flex">
            <li className={(active==='profile')?activeForHome:" cursor-pointer sm:pl-4 pl-2 text-sm sm:text-base text-white font-inter"}>
              Profiles
            </li>
            <li className="cursor-pointer sm:pl-4 pl-2 text-sm sm:text-base text-white font-inter">
              Suggesetions
            </li>
            <li className="cursor-pointer sm:pl-4 pl-2 text-sm sm:text-base text-white font-inter">
              Search
            </li>
            <li className="cursor-pointer sm:pl-4 pl-2 text-sm sm:text-base text-white font-inter">
              Inbox
            </li>
          </ul>
        </div>
        <div className='sm:w-1/6 w-2/6 h-full  justify-evenly flex items-center flex-row'>
          <p
            className="font-aborato font-extrabold sm:text-base text-xs text-white cursor-pointer mb-14 sm:mb-0"
            onClick={handleLogout}
          >
            LOG OUT
          </p>
          <div className="sm:w-16 sm:h-16 w-10 h-10 rounded-[50%] ">
            <img
              src={image ? image : "/profile.png"}
              className="rounded-full w-full h-full"
              alt=""
            />
          </div>
        </div>
        <div></div>
      </nav>
  )
}
