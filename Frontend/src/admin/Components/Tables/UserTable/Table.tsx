import React, {useEffect, useMemo, useState} from 'react';
import { useTable,usePagination} from 'react-table';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

import { Columns } from './UserHeadSchema'
import { TableDataType } from './userTable';

import { request } from '../../../../utils/axiosUtils';
import { useNavigate } from 'react-router-dom';

export interface UserListInterface{
  triggerPagination:()=>void
} 


export const UserTable:React.FC = () => {
  const navigate=useNavigate()
  function handleClick(id:string){
    alert(id)
  }

  const [MockData,setMockData]=useState<TableDataType[]>([]) 
  async function blockUser(id:string,name:string,status:string){
    if(confirm(`Do you want to ${status} ${name}`)){
      const updateStatus=(status==='block')?true:false
      const response:any= await request({url:'/admin/block&Unblock',method:'patch',data:{updateStatus:updateStatus,id}})
      console.log(response)
      if(response.message==='validation Faild'){
        alert(response.message)
        navigate('/login')
      }
      if(response?.message){
        setMockData(el=>el.map(user=>(user._id===id)?{...user,block:updateStatus}:user))
        console.log(data)
        alert(`${name} blocked`)
        
      } 
    }
  }
  const [searchWord,setSearchWord]=useState<string>('')
  useEffect(()=>{
   async function fetchData (){
    try {
      const MockDataFromDb:any=await request({url:`/admin/fetchData`,method:'get'})
      if(MockDataFromDb?.message==='validation Faild'){
        alert(MockDataFromDb.message)
        navigate('/login')
      } 
      setMockData(MockDataFromDb)
    } catch (error) {
      
    }
  
   }
   fetchData()
  },[])

  
  function handleSearch(e:React.ChangeEvent<HTMLInputElement>){
    setSearchWord(e.target.value)
  }
  const filterData=useMemo(()=>{
    return MockData.filter(user=>user.username.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()))
  },[searchWord,MockData])
  const columns=useMemo(()=>Columns,[])
  const data=useMemo(()=>filterData??[],[filterData])
 
  
    const { getTableProps, getTableBodyProps, headerGroups,rows, prepareRow } = useTable({ columns, data },usePagination);
  
    return (
      <>
        
        <div className="h-full w-10/12 flex flex-col items-center">
          <div className="w-full h-1/5  mt-20 flex justify-center items-center">
          <div className="w-[95%] h-5/6 bg-dark_red rounded-lg flex justify-end items-center pr-7">
          <input type="search" value={searchWord} onChange={handleSearch} className="cursor-text bg-white mr-3 h-8 pl-6 text-dark_red placeholder:text-dark_red placeholder:font-bold outline-none " placeholder="Search Here....."/>
         
          </div>
          </div>
          <div className="w-[95%] h-3/5 overflow-auto no-scrollbar ">
          <Paper>
          <Table  {...getTableProps()} className='border-2 border-dark_red bg-dark_red'>
            <TableHead className='bg-dark_red bottom-2 border-white'>
              {headerGroups.map((headerGroup,index) => (
                <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map(column => (
                    <TableCell {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()} className='bg-red-400'>
              {rows.map((row,rowIndex) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()} key={rowIndex} className='text-start'>
                    {row.cells.map(cell => (
                      <TableCell  {...cell.getCellProps()} >
                        {cell.render('Cell')}</TableCell>
                    ))}
                    <TableCell>
                      <img onClick={()=>handleClick(row.original._id)} className='w-10 h-10 cursor-pointer' src="/info.png" alt="" />
                      
                      </TableCell>
                      <TableCell>
                      
                      
                      {!(row.original.block)?<img onClick={()=>blockUser(row.original._id,row.original.username,'block')} src="/user.png"  className='w-5 h-5 cursor-pointer' alt="" />:<img src="/block-user.png" onClick={()=>blockUser(row.original._id,row.original.username,"unblock")} className='w-5 h-5 cursor-pointer' alt="" /> }
                      </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
          </div>
          <div className="w-full h-1/5 flex justify-center items-center">
            <button  className="bg-dark_red text-white rounded-full h-14 w-14" >{'<<'}</button>
            <button className="bg-dark_red text-white rounded-full h-14 w-14 ml-1 font-bold ">{'>>'}</button>
          </div>
        </div>
           </> 
      );
}
