// import * as React from 'react';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

import { ClassNames } from "@emotion/react"

// export default function CircularIndeterminate() {
//   return (
    
//   );
// }


{toggle&&
          <div className=" h-full w-full justify-center flex flex-col items-center">
          <h1 className="font-bold text-2xl text-dark_red mt-2 mb-5">
            DETAILS
          </h1>
          <div className="w-[100%] h-[11%]  border-b border-dark_red    justify-between mb-10">
          <label className="text-dark_red font-bold">NAME</label>
            <p className="hover:font-medium">{currentData?.name}</p>
            
          </div>
          <div className="w-[100%] h-[20%]  mb-2 flex justify-between">
            <div className="w-[30%] h-14  border-b border-dark_red  ">
              <label className="text-dark_red font-bold">AMOUNT</label>
              
              <p className="mt-1 hover:font-medium ">{currentData?.amount}</p>
            </div>
            <div className="w-[30%] h-14 border-b border-dark_red  ">
              <label className="text-dark_red font-bold">CONNECT</label>
              <p className="mt-1 hover:font-medium ">{currentData?.connect}</p>
            </div>
            <div className="w-[33%] h-14 border-b border-dark_red ">
              <label className="text-dark_red font-bold">DURATION</label>
              {/* <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} /> */}
            
              <p className="mt-1 hover:font-medium">{currentData?.duration}</p>
            </div>
          </div>
          <div className="w-[100%] h-[30%] border  bg-gray-200">
            {currentData?.features&&currentData?.features.map((el,index)=>{
              return(
                <div key={index} className='w-full h-[20%] mt-2 bg-dark_red hover:bg-red-900  flex'>
                       
                <div className='w-[90%] h-full flex  items-center text-white px-2 '>
                    
                    <p >{index+1}.<span className='pl-2'>{el}</span></p>
                </div>
                
                
            </div> 
              )
            })}
         
          </div>
          <button onClick={()=>manageBtwAddEdit('Edit',currentData?._id)} className="border border-dark_red mt-2 py-2 px-8 font-bold rounded-3xl hover:bg-dark_red hover:text-white ">MAKE CHANGES</button>
          </div>
          }


    //       ClassNames="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md">
    // <span class="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
    // <span class="relative px-6 py-3 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
    //     <span class="relative text-white">Button Text</span>
    // </span>