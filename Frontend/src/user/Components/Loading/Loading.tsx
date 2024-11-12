import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loading = () => {
  return (
    <div className=" fixed  top-60 right-96   h-1/5 w-1/3 flex justify-center items-center ">
     <Box sx={{ display: 'flex'  }}>
     <CircularProgress disableShrink />

    </Box>
     </div>
    
  );
};
