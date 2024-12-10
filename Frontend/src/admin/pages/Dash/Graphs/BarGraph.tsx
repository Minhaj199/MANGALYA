import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { request } from "../../../../utils/axiosUtils";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [datas,setData]=useState<{month:number[],revenue:number[]}>()
    useEffect(()=>{
        console.log(datas)
    },[])
  useEffect(()=>{
    async function FetchData(){
        try {
            const response:{month:number[],revenue:number[]}=await request({url:'/admin/getDataToDash?from=Revenue'})
            console.log(response.month)
            setData({month:response.month,revenue:response.revenue})
        } catch (error) {
            
        }
        
    }
    FetchData()
  },[])
  const data = {
    labels: datas?.month, 
    datasets: [
      {
        label: "Revenue",
        data: datas?.revenue,
        backgroundColor: ["#FF5733", "#FF6347", "#C70039", "#1B1464"], 
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: "Revenue",
        align: "start",
        font: { size: 20, weight: "bold" }, 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200, 
        },
      },
    },
  };

  return (
    <div style={{ width: "400px", margin: "auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontWeight: "bold", margin: 0 }}>Revenue 2024 year</h2>
        {/* <select style={{ padding: "5px" }}>
          <option>Monthly</option>
          <option>Quarterly</option>
        </select> */}
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
