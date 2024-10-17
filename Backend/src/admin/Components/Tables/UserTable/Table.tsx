import {useEffect, useMemo, useState} from 'react';
import { useTable,usePagination} from 'react-table';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

import { Columns } from './UserHeadSchema'
import { TableDataType } from './userTable';
import axios from 'axios';




export const UserTable = () => {
  function handleClick(id:number){
    alert(id)
  }
  const [MockData,setMockData]=useState<TableDataType[]>([]) 
  
  useEffect(()=>{
   async function fetchData (){
    try {
      const MockDataFromDb=await axios({
        url:'http://localhost:8000/admin/fetchData',
        method:'get'
      })
      console.log(MockDataFromDb.data)
      setMockData(MockDataFromDb.data)
    } catch (error) {
      
    }
  
   }
   fetchData()
  },[])
  
    console.log(MockData)
    const columns=useMemo(()=>Columns,[])
    const data=useMemo(()=>MockData??[],[MockData])
   
    const { getTableProps, getTableBodyProps, headerGroups,rows, prepareRow } = useTable({ columns, data },usePagination);
  
    return (
      <>
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
                  <TableRow {...row.getRowProps()} key={rowIndex}>
                    {row.cells.map(cell => (
                      <TableCell  {...cell.getCellProps()} >
                        {cell.render('Cell')}</TableCell>
                    ))}
                    <TableCell>
                      <img onClick={()=>handleClick(row.original.no)} className='w-10 h-10 cursor-pointer' src="/info.png" alt="" />
                      </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
       
           </>
      );
}
