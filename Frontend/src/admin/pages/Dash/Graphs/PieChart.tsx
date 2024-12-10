import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { request } from "../../../../utils/axiosUtils";
import { alertWithOk } from "../../../../utils/alert/sweeAlert";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC = () => {
    const [dashCount,setDashCount]=useState<number[]>([0,0])
  
    useEffect(()=>{
        async function fetchData(){
            try {
                const response:number[]=await request({url:'/admin/getDataToDash?from=SubscriberCount'})
                
                setDashCount(response)
            } catch (error:any) {
                alertWithOk('Dash Error',error.message||'error on dash',"error")
            }
        }
        fetchData()
    },[])
  const data = {
    labels: ["subscriber", "not subscriber"],
    datasets: [
      {
        label: "Subscribers",
        data: dashCount, 
        backgroundColor: ["#1F77B4", "#D3D3D3"], 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div style={{ width: "300px", margin: "auto", textAlign: "center" }}>
      <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
        subscribers and not subscribers
      </h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
