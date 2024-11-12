import "./Landing.css";

import { Footer } from "../Components/User/Footer/Footer";
import { useState } from "react";
import { Forgot_first } from "../Components/User/Forgot/Forgot_first";
import { Forgot_second } from "../Components/User/Forgot/Forgot_second copy"; 
import { Forgot_Final } from "../Components/User/Forgot/Forgot_final";
import { Login } from "../Components/User/Login/Login";

import { Search } from "../Components/User/HomeCards/HomeCards";

export const Landing = () => {
  const [loginTogle, changeTogle] = useState<string>("1");
  
  
  

  return (
    <div className="container">
      <div className="w-screen h-svh bg-cover bg-center first_part">
        <div className={loginTogle !== "1" ? "hidden" : "w-full h-full"}>
          <div className="w-full h-20   flex justify-between items-center p-5 ">
            <div className=" sm:h-16 sm:w-18 h-12 w-18">
            
            
            <img
              className="w-full h-full  cursor-pointer"
              src="./logo-no-background.png "
              alt=""
            />
            </div>
              
            <div
              onClick={() => changeTogle("2")}
              className="w-24 h-10 border border-white border-opacity-15 flex justify-center cursor-pointer items-center mr-5 relative top-0 left-0 right-0"
            >
              <p className="text-white font-italian ">LOGIN</p>
            </div>
            
          </div>
          <div className="w-screen h-2/4 flex justify-center  items-end">
            <h1 className="font-italian relative text-xl  text-white sm:text-3xl">
              Connecting Souls: Find Your Other Half
            </h1>
          </div>
          <div className="w-screen h-1/4  justify-center items-end flex">
           
          </div>
        </div>
        <Login
          changeToggle={changeTogle}
          loginTogle={loginTogle}
        />
        {loginTogle === "3" ? <Forgot_first changeToggle={changeTogle} /> : ""}
        {loginTogle === "4" ? <Forgot_second changeToggle={changeTogle} /> : ""}
        {loginTogle === "5" ? <Forgot_Final changeToggle={changeTogle} /> : ""}
      </div>
      <div className="w-screen h-auto  sm:h-auto lg:h-svh ">
        
       <Search />
      </div>
      <Footer />  
    </div>
  );
};
