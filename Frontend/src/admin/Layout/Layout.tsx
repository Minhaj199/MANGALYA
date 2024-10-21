
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
export const Layout = () => {
  const navigate=useNavigate()
  function handleLogOut(){
    localStorage.removeItem('adminToken')
    navigate('/login')   
  }
  
  return (
    <>
    
    <div className='w-full h-20 bg-dark_red fixed   flex items-center justify-between p-2'>
        <img className='w-18 h-16' src="/logo-no-background.png" alt="" />
        <img className='w-8 h-8 cursor-pointer' src="/sign-out-option.png" onClick={handleLogOut} alt="" />
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
       <Outlet/>
    </div>
    </>
    
  )
}
