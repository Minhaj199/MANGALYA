import React, {useEffect, useMemo, useState} from 'react';
import { useTable,usePagination} from 'react-table';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

import { Columns } from './UserHeadSchema'
import { SubscriberTableDataType } from './SubscriberTableDataType'; 

import { request } from '../../../utils/axiosUtils';
import { useNavigate } from 'react-router-dom';
import { alertWithOk, promptSweet } from '../../../utils/alert/sweeAlert';

export interface UserListInterface{
  triggerPagination:()=>void
} 


export const SubscriberTable:React.FC = () => {
  const navigate=useNavigate()
  type planDataType={
    name:string
  }
  interface data{
    planData:planDataType[],
    userData:SubscriberTableDataType[],
    message:string
  }

  const [MockData,setMockData]=useState<SubscriberTableDataType[]>([]) 
  const[ planData,setPlanData]=useState<planDataType[]>([{name:''}])
  const [searchWord,setSearchWord]=useState<string>('')
 
 
 ///fetch data///
  useEffect(()=>{
    async function fetchData (){
      try {
        const data:data=await request({url:`/admin/fetchData?from=subscriber`,method:'get'})
        if(data.planData){
          setPlanData(data.planData) 
          
        }
        
        if(data?.message==='validation Faild'){
          alertWithOk('Validation',data.message||'Validation faild','info')
          navigate('/login')
        } 
        setMockData(data.userData)
      } catch (error) {
        
      }
      
    }
    fetchData()
  },[])
  
  
 ///// fitlter data when sortin initiated
    const filterData=useMemo(()=>{
      
      return MockData.filter(plan=>plan.planName.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()))
    },[searchWord,MockData])
  
  
    const columns=useMemo(()=>Columns,[])
    const data=useMemo(()=>filterData??[],[filterData])
   
    ///// sorting///////
    function handleFilter(t:React.ChangeEvent<HTMLSelectElement>){
      const value=t.target.value
      if(value==='All'){
        setSearchWord('')
      }else{
        setSearchWord(value)
      }
    }
   
  
    const { getTableProps, getTableBodyProps, headerGroups,page, nextPage,setPageSize,previousPage,prepareRow,canNextPage,canPreviousPage,pageOptions,state } = useTable({ columns, data },usePagination);
    const {pageIndex,pageSize}=state
    return (
      <>
        <div className="h-full w-10/12  flex flex-col items-center">
          <div className="w-full h-1/5   flex justify-center items-center">
            <div className="w-[95%] h-5/6 drop-shadow-lg bg-white rounded-lg flex justify-between items-center ">
            <p className=' ml-5 font-extrabold sm:text-base text-xs  font-inter text-dark-blue'>SUBSCRIBER DATA</p>
            <select onChange={handleFilter} className='cursor-pointer bg-white mr-3 h-8 w-20 sm:w-48 pl-2  text-dark-blue border border-dark-blue  sm:placeholder:text-sm  outline-none'  id="">
              <option value="All">All</option>
              {planData[0].name!==''&&planData.map((el,index)=>(
                <option key={index} value={el.name}>{el.name}</option>
              ))}
              
            </select>
          </div>
          </div>
          <div className="w-[95%] h-3/5 mt-10 overflow-auto no-scrollbar ">
          <Paper>
          <Table   {...getTableProps()} className='border-2 border-dark-blue bg-dark-blue'>
            <TableHead  className='bg-dark-blue bottom-2  '>
              {headerGroups.map((headerGroup,index) => (
                <TableRow   {...headerGroup.getHeaderGroupProps()}  key={index}>
                  {headerGroup.headers.map(column => (
                    <TableCell style={{color:'white'}}    {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()} className='bg-gray-200 '>
              {page.map((row,rowIndex) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()} key={rowIndex} className='text-start hover:bg-slate-400 '>
                    {row.cells.map(cell => (
                      <TableCell className='text-lg'  {...cell.getCellProps()} >
                        {cell.render('Cell')}</TableCell>
                    ))}
                    {/* <TableCell>
                      <img onClick={()=>handleClick(row.original._id)} className='w-10 h-10 cursor-pointer' src="/info.png" alt="" />
                      
                      </TableCell> */}
                     
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
          </div>
          <div className="w-full h-1/5 flex justify-center items-center">
          <span className='mr-5 sm:mb-0 mb-3'>page{' '} <strong>{pageIndex+1} of {pageOptions.length}</strong>{' '}</span>
            <button  onClick={()=>previousPage()} disabled={!canPreviousPage} className="bg-dark-blue text-white rounded-full sm:h-14 sm:w-14 h-8 w-8 sm:mb-0 mb-5" >{'<<'}</button>
            <button onClick={()=>nextPage()} disabled={!canNextPage} className="bg-dark-blue text-white rounded-full sm:h-14 sm:w-14 h-8 w-8 ml-1 sm:mb-0 mb-5  font-bold ">{'>>'}</button>
          </div>
        </div>
           </> 
      );
}
