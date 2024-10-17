
import { Outlet } from "react-router-dom"
export const Layout = () => {
  return (
    <>
    
    <div className='w-full h-20 bg-dark_red fixed   flex items-center justify-between p-2'>
        <img className='w-18 h-16' src="/logo-no-background.png" alt="" />
        <img className='w-8 h-8' src="/sign-out-option.png" alt="" />
    </div>
    <div className='w-full h-lvh bg-white flex'>
        <div className='h-full w-2/12 pt-20 bg-dark_red'>
         <div className='w-full h-16 border border-red_FA0000  flex justify-center items-center text-white'>
            <p className='text-[10px] sm:text-[16px] md:text-[20px] font-inter font-extrabold'>DASHBOARD</p>
         </div>
         <div className='w-full h-16 border border-red_FA0000 mt-1 flex justify-center items-center text-white  bg-red_Active'>
         <p className='text-[10px] sm:text-[16px] md:text-[20px] font-inter font-extrabold'>USER</p>
         </div>
         <div className='w-full h-16 border border-red_FA0000 mt-1 flex justify-center items-center text-white'>
         <p className='text-[10px] sm:text-[16px] md:text-[20px] font-inter font-extrabold'>PLAN</p>
         </div>
         <div className='w-full h-16 border border-red_FA0000 mt-1 flex justify-center items-center text-white'>
         <p className='text-[10px] sm:text-[16px] md:text-[20px]  font-inter font-extrabold'>SUBSCRIPTION</p>
         </div>
         <div className='w-full h-16 border border-red_FA0000 mt-1 flex justify-center items-center text-white'>
         <p className='text-[10px] sm:text-[14px] md:text-[20px]  font-inter font-extrabold'>REPORT USER</p>
         </div>
        </div>
        <div className="h-full w-10/12 flex flex-col items-center">
          <div className="w-full h-1/5  mt-20 flex justify-center items-center">
          <div className="w-[95%] h-5/6 bg-dark_red rounded-lg flex justify-end items-center pr-7">
          <input type="search" className="cursor-text bg-white mr-3 h-8 pl-6 text-dark_red placeholder:text-dark_red placeholder:font-bold outline-none " placeholder="Search Here....."/>
          <button className="w-16 h-8 bg-white inline-flex justify-center items-center cursor-pointer"><img className="w-1/3" src="/search-interface-symbol.png" alt="" /></button>
          </div>
          </div>
          <div className="w-[95%] h-3/5 overflow-auto no-scrollbar ">
          <Outlet/>
          </div>
          <div className="w-full h-1/5 flex justify-center items-center">
            <button className="bg-dark_red text-white rounded-full h-14 w-14">{'<<'}</button>
            <button className="bg-dark_red text-white rounded-full h-14 w-14 ml-1 font-bold ">{'>>'}</button>
          </div>
        </div>
    </div>
    </>
    
  )
}
