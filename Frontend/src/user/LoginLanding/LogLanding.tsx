import React, { useEffect, useState } from 'react'
import { request } from '../../utils/axiosUtils'
import { useNavigate } from 'react-router-dom'
import { handleAlert } from '../../utils/sweeAlert'
type profileType={id:string,name:string,no:number}

export const LoginLanding = () => {
    const navigate=useNavigate()
    const [profils,setProfiles]=useState<profileType[]>()
    useEffect(()=>{
       async function fetch(){
        const response:profileType[]=await request({url:'/user/fetchProfile'})
        const res=response??[]
        setProfiles(res)
       }
       fetch()
    },[])
    function handleLogout(){
        localStorage.removeItem('userToken')
        handleAlert('warning','user loged out')
        navigate('/')
    }
  return (
    <div className='h-[1500px] w-screen bg-gray-400'>
        <nav className='w-full fixed top-0 left-0 right-0 h-24 flex bg-dark_red'>
            <div className='w-1/6 h-full flex items-center'>
                        <img
              className="md:w-18 md:h-16   cursor-pointer"
              src="/png/logo-no-background.png "
              alt=""
            />
          
            </div>
            <div className='lg:w-4/6 h-full md:w-3/6  flex py-9 pl-10   '>
            <ul className=' flex'>
                <li className='pl-4 text-white font-inter'>Profiles</li>
                <li className='pl-4 text-white font-inter'>Suggesetions</li>
                <li className='pl-4 text-white font-inter'>Search</li>
                <li className='pl-4 text-white font-inter'>Inbox</li>
            </ul>
            </div>
            <div className='w-1/6 h-full  justify-evenly flex items-center md:flex-row flex-col'>
            <p className='font-aborato font-extrabold text-white cursor-pointer' onClick={handleLogout}>LOG OUT</p>
            <div className='w-20 h-20 rounded-[50%]'>
                <img src="/profile.png" alt="" />
            </div>
            </div>
            <div></div>
        </nav>
        <div className='w-screen h-full mt-24  flex'>
            <div className='w-3/12 h-[50%] bg-red-500'></div>
            <div className='w-[75%] h-full overflow-scroll  '>
            {profils?.map((el)=>{
    return(
      
    <div className='w-[80%] h-[12%] bg-white mx-14 my-16 flex' key={el.no}>
        <div className='w-[30%] h-full bg-gray-950'>
            <img className='h-full w-full' src="/pexels-mostafasanadd-868113.jpg" alt="" />
        </div>
        <div className='w-[70%] h-full  p-10'>
            <h1 className='text-3xl'>{el?.name}</h1>
        </div>
    </div>

    )
})}
            </div>
           
        </div>
    </div>
  )
}

