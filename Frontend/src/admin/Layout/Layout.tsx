
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
    
    {/* <div className='w-full h-20 bg-admin_panel_Blue fixed   flex items-center justify-between p-2'>
        
        <img className='w-8 h-8 cursor-pointer' src="/sign-out-option.png"  alt="" />
    </div> */}
    <div className='w-full h-lvh bg-white flex'>
        <div className='h-full w-2/12  bg-admin_panel_Blue'>
        <div className="w-full h-40 flex justify-center items-center">
        <img className='w-18 h-16' src="/logo-no-background.png" alt="" />
        </div>
        
         <div className='cursor-pointer hover:bg-blue-900 w-full h-16   flex justify-center items-center text-white'>
            <p className='text-[10px] sm:text-[16px] md:text-[12px] font-inter font-extrabold'>DASHBOARD</p>
         </div>
         <div className='cursor-pointer hover:bg-blue-900 w-full h-16  mt-1 flex justify-center items-center text-white  bg-[#1a1aff]'>
         <p className='text-[10px] sm:text-[16px] md:text-[12px] font-inter font-extrabold'>USER</p>
         </div>
         <div className='cursor-pointer hover:bg-blue-900 w-full h-16  mt-1 flex justify-center items-center text-white'>
         <p className='text-[10px] sm:text-[16px] md:text-[12px] font-inter font-extrabold'>PLAN</p>
         </div>
         <div className='cursor-pointer hover:bg-blue-900 w-full h-16  mt-1 flex justify-center items-center text-white'>
         <p className='text-[10px] sm:text-[16px] md:text-[12px]  font-inter font-extrabold'>SUBSCRIPTION</p>
         </div>
         <div className='cursor-pointer hover:bg-blue-900 w-full h-16  mt-1 flex justify-center items-center text-white'>
         <p className='text-[10px] sm:text-[14px] md:text-[12px]  font-inter font-extrabold'>REPORT USER</p>
         </div>
         <div onClick={handleLogOut} className='cursor-pointer hover:bg-blue-900 w-full h-16  mt-1 flex justify-center items-center text-white '>
         <p className='text-[10px] sm:text-[14px] md:text-[12px]  font-inter font-extrabold' >LOGOUT</p>
         </div>
        </div>
       <Outlet/>
    </div>
    </>
    
  )
}
