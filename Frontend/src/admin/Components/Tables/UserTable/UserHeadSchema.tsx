import { Column } from "react-table";
import { TableDataType } from "./userTable";
export const  Columns: Column<TableDataType>[] = [
    {
      Header: 'no',
      accessor: 'no'  
    },
    {
      Header: 'name',
      accessor: 'username'  
    },
    {
      Header: 'email',
      accessor: 'email'  
    },
    {
      Header: 'matches',
      accessor: 'match'  
    },
    {
      Header: 'subscribed',
      accessor: 'subscriber'  
    },
    {
      Header: 'expiry',
      accessor: 'expiry',
    }
  ];
  