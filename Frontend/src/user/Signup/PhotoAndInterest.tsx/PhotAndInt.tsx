
import React, {  useRef, useState,SetStateAction,Dispatch, useEffect } from 'react'
import { PhotoAndInterest } from '../Credentials'

interface PhotAndIntInterface{
    probState:PhotoAndInterest;
    probSetter:Dispatch<SetStateAction<PhotoAndInterest>>
}

export const PhotAndInt:React.FC<PhotAndIntInterface> = ({probState,probSetter}) => {
    const [selected,setSelected]=useState<string[]>([])
    let interestCount=useRef(0)
    const [image,setImage]=useState<string|null>(null)
    useEffect(()=>{
        probSetter(el=>({...el,interest:selected}))
    },[selected,image])
   
    const interestCategory:ReadonlyArray<string>=['sports','music','food']
    const [handleChange,setHandleChang]=useState<string[]>([])
    const  interest:{'sports':string[],'music':string[],food:string[]}={
        'sports':['Football','Cricket','Hocky'],
        'music':['Hollywood','Bollywood','Molywood'],
        'food':['Biryani','Sadya']

    }as const
    const fileInputRef=useRef<HTMLInputElement>(null)
    function handleClick(){
        if(fileInputRef.current){
            fileInputRef.current.click()
        }
    }
   function handleFile(t:React.ChangeEvent<HTMLInputElement>){
    if(t.target.files?.length&&t.target.files?.length>0){
        const file=t.target.files[0]
        probSetter(el=>({...el,photo:file}))
        const imageUrl=URL.createObjectURL(t.target.files?.[0])
        setImage(imageUrl)
    }
   }
   function handleCategoryInterest (t:React.ChangeEvent<HTMLSelectElement>){
    console.log(t.target.value)
       if(t.target.value){
        console.log(29)
        if(t.target){
            console.log(31)
            const key=t.target.value
            console.log(key)
            if(key==='sports'||key==='music'||key==='food'){
                console.log(34)
                setHandleChang(interest[key])
                
                
            }
        }
    }else{
        setHandleChang([])
       
    }
   }
   function handleAddInterest (t:React.ChangeEvent<HTMLSelectElement>){
        if(t.target.value&&!selected.includes(t.target.value)){
            setSelected(el=>[...el,t.target.value])
            interestCount.current++
        }
        if(interestCount.current===5){
            setHandleChang([])
            console.log(selected)
        }
       
   }
   function handleRemove(item:string){
       setSelected(el=>{
           return el.filter(el=>el!==item)
        }
        
    )
    interestCount.current--
}

    function resetPhoto(){
    probSetter(el=>({...el,photo:null}))
    
   }
  return (
 
    <div className='w-5/6 h-72 sm:mt-0 flex'>
        <div id='photo'  className='flex flex-col justify-center cursor-pointer items-center w-1/3 h-full '>
        <div className='sm:h-32 sm:w-32 h-16 w-16 rounded-full bg-gray-950 absolute' onClick={handleClick}>
            <input type="file" ref={fileInputRef} onChange={handleFile} className='hidden' accept='image/*' />
            <img className='w-full h-full rounded-full' src={image?image:"/photoUpload.png"} alt="" />
            
            {!image&&<img className='sm:w-7 sm:left-24 sm:h-7 relative bottom-5 w-4 h-4' src="/photo-camera-interface-symbol-for-button.png" alt="" />}
            {image&&<img className='sm:w-7 sm:left-24 sm:h-7 relative bottom-5 w-4 h-4' src="/deleteRemove.png" onClick={()=>(setImage(null),resetPhoto())} alt="" />}
        </div>
        </div>
        <div className='w-2/3 h-full  flex flex-col'>
        <div className='w-full h-[40%] items-center  sm:flex  '>
        {interestCount.current!==5&&
        
            <select name="" id="" onChange={(t)=>handleCategoryInterest(t)} className='w-[30%]   h-9 outline-none'>
                <option value="">Interst Category</option>
                {interestCategory.map((el,index)=>{
                    return <option key={index} value={el}>{el}</option>
                })}  
            </select>
    }
            {(handleChange.length>0)&&
            
            <select name="" id="" className='w-[30%] ml-10 h-9 outline-none' onChange={handleAddInterest}>
                <option value="">Interst</option>
               {handleChange.map((el,index)=>{
                  return <option key={index} value={el}>{el}</option> 
               })}
            </select> 
            }
           
        </div>
        <div className='w-full sm:h-[60%] h-72 sm:mt-0 mt-14 mb-10 bg-white'>
            {selected.length>0&&selected.map((el,index)=>{
                return <div key={index} className='flex justify-between items-center w-full h-8 bg-slate-200 mt-1'><p>{index+1}:{el}</p>
                <img src="/remove.png" className='w-4 h-4 mr-1 cursor-pointer' onClick={()=>handleRemove(el)} alt="" />
                </div>
            })}
             
            
        </div>
        {/* <input type="text" className='bg-red-300' />
        <input type="text" />
        <div className='w-[80%] h-28 bg-white'></div> */}
        </div>
    </div>
  )
}