import './plan.css'

export const PlanMgt = () => {
    const months=Array.from({length:36},(_,index)=>index+1)
    console.log(months)
  return (
    <div className='w-full h-full bg-slate-300'>
        <div className='w-full h-[25%]  flex justify-center items-center'>
            <div className='w-[80%]  h-[95%] border border-dark_red bg-white overflow-x-auto flex'>
                <div className='w-44 mx-6 my-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center font-inter font-semibold'>
                        silver
                    </div>
                </div>
                {/* <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div>
                <div className='w-44 m-2 rounded-lg  h-[90%] bg-black flex flex-col'>
                    <div className='w-[90%] h-[20%] ml-1   text-end font-bold text-white'>X</div>
                    <div className='w-[100%] h-[80%] text-white flex justify-center items-center'>
                        silver
                    </div>
                </div> */}

                
               
                
            </div>
            <div className='w-[17%] h-[95%] ml-2 bg-white border border-dark_red flex justify-center items-center '>
                <p className='text-dark_red font-bold'>ADD</p>
            </div>
        </div>
        <div className='w-full h-[75%]  flex justify-center items-center'>
            <div className='sm:w-[40%] w-[80%] sm:h-[90%] h-[90%] rounded-3xl bg-white px-10 items-center flex flex-col'>
                <h1 className='font-bold text-2xl text-dark_red mt-2 mb-5'>DETAILS</h1>
                <div className='w-[100%] h-[20%]    justify-between mb-2'>
                    <label htmlFor="" className='block font-inter font-bold text-dark_red'>NAME</label>


                    <input type="text"  className=' w-[90%] border-b border-b-dark_red  outline-none' />
                    
                    
                    
                    
                    {/* <input type="text" className='border border-black focus:border-blue-500 'placeholder='type hear' /> */}
                    <p className='mt-1'>i am warning</p>

                </div>
                <div className='w-[100%] h-[20%]  mb-2 flex justify-between'>
                    <div className='w-[33%] h-full '>
                    
                        <label className='text-dark_red font-bold'>AMOUNT</label>
                        <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} />
                        <p className='mt-1'>warning</p>
                    
                    </div>
                    <div className='w-[33%] h-full '>
                    <label className='text-dark_red font-bold'>CONNECTION</label>
                        <input id='amount' type="number" className='mt-1 w-[80%] outline-none'min={1} max={10000} />
                        <p className='mt-1 '>warning</p>
                    </div>
                    <div className='w-[33%] h-full'>
                    <label className='text-dark_red font-bold'>DURATION</label>
                        {/* <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} /> */}
                        <select className='h-8 outline-none border-b border-dark_red' name="" id="">
                           <option value="" >Month</option>
                           {months.map((el,index)=> <option key={index} value={el}>{el} month</option>)}
                          
                        </select>
                        <p className='mt-1'>warning</p>
                    </div>
                </div>
                <div className='w-[100%] h-[30%] bg-slate-900'>
                    <div className='w-full h-[80%] bg-slate-700'></div>
                </div>
                <button className='bg-gray-400 mt-2'>EDIT</button>
            </div>
        </div>
    </div>
  )
}
