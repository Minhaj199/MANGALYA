import React, { useEffect, useState } from "react";
import "./plan.css";
import { request } from "../../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import {
  alertWithOk,
  handleAlert,
  promptSweet,
} from "../../../utils/alert/sweeAlert";

import { planMgtWarningType } from "../AddPlan/AddPlan";
import { PlanValidator } from "../../../Validators/planValidator";

export type PlanType = {
  _id: string;
  name: string;
  delete: boolean;
  duration: number;
  features: string[];
  amount: number;
  connect: number;
};

export const PlanDetails = () => {
  const [warning, setWarning] = useState<planMgtWarningType>({
    amount: "",
    connect: "",
    duration: "",
    name: "",
  });
  const navigate = useNavigate();
  const [editData, setEditData] = useState<PlanType>({
    _id: "",
    amount: 0,
    connect: 0,
    delete: true,
    duration: 0,
    features: [""],
    name: "NO PLANS",
  });
  const months = Array.from({ length: 36 }, (_, index) => index + 1);
  const [toggle, setToggle] = useState<boolean>(true);
  const [datas, setData] = useState<PlanType[]>([
    {
      _id: "",
      amount: 0,
      connect: 0,
      delete: true,
      duration: 0,
      features: [""],
      name: "NO PLANS",
    },
  ]);
  const [currentData, setCurrentData] = useState<PlanType>();

  let dataDB: PlanType[];
  useEffect(() => {
    async function fetchPlanData() {
      dataDB = await request({ url: "/admin/fetchPlanData" });
      setData(dataDB);
    }
    fetchPlanData();
  }, []);
  useEffect(() => {
    if (datas) {
      setCurrentData(datas[0]);
    }
  }, [datas]);
  useEffect(() => {
    if (!toggle && currentData) {
      setEditData(currentData);
    } else if (toggle) {
      setEditData({
        _id: "",
        amount: 0,
        connect: 0,
        delete: false,
        duration: 0,
        features: [""],
        name: "",
      });
    }
  }, [toggle]);
  function handleInserData(el: string) {
    if (datas) {
      const singleData = datas.filter((elem) => elem._id === el);
      if (singleData.length && singleData) {
        setCurrentData(singleData[0]);
      }
    } else {
    }
  }
  async function handleRemovePlan(id: string, name: string) {
    await promptSweet(
      deletePlan,
      `Do you want to remove ${name} plan ?`,
      `plan ${name} removed`
    );
    async function deletePlan() {
      try {
        const response: { response: boolean; message: string } = await request({
          url: "/admin/removePlan",
          method: "patch",
          data: { id: id },
        });
        if (response.response) {
          setData((el) => el.filter((elem) => elem._id !== id));
          if (currentData?._id === id) {
            setCurrentData(datas[0]);
          }
          handleAlert("success", "Plan removed");
        } else {
          throw new Error(response.message);
        }
        console.log(response);
      } catch (error: any) {
        alertWithOk(
          "Plan Remove",
          error.message || "Error occured on deleting",
          "error"
        );
      }
    }
  }
  function manageBtwAddEdit(action: "Edit" | "Details", id: unknown) {
    if (typeof id === "string") {
      if (action === "Edit") {
        setToggle(false);
      }
    } else {
      handleAlert("error", "Error occured");
    }
  }
  function handleClose(el: string) {
    setEditData((datas) => {
      return {
        ...datas,
        features: datas.features.filter((element) => element !== el),
      };
    });
  }
  function changeOnfeature(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!editData.features.includes(e.target.value)) {
      setEditData((el) => ({
        ...el,
        features: [...el.features, e.target.value],
      }));
    }
  }
  async function handleSubmission() {
    if (PlanValidator(editData, setWarning, editData.features)) {
      try {
        const response: { response: true; message: string } = await request({
          url: "/admin/editPlan",
          method: "put",
          data: editData,
        });
        console.log(response);
        if (response.response) {
          setData((el) =>
            el.map((element) =>
              element._id === editData._id ? editData : element
            )
          );
          setCurrentData(editData);
          setEditData({
            _id: "",
            amount: 0,
            connect: 0,
            delete: true,
            duration: 0,
            features: [""],
            name: "NO PLANS",
          });
          setToggle(true);
          alertWithOk("Plan Edit", "Plan edited successfully", "success");
        } else {
          throw new Error(response.message);
        }
      } catch (error: any) {
        alertWithOk(
          "Plan Edit",
          error.message || "Error occured on editing",
          "error"
        );
      }
    }
  }
  return (
    <div className="w-screen h-full  overflow-hidden ">
      {!toggle && (
        <div className="w-52 h-10 font-bold flex justify-center items-end">
          <p
            onClick={() => setToggle(true)}
            className=" text-input_dark cursor-pointer"
          >
            BACK
          </p>
        </div>
      )}

      {toggle && (
        <div className="w-full h-[25%]  flex justify-center items-center">
          {/* <div className="w-[80%]  h-[95%] border  bg-white overflow-y-auto flex"> */}
          {/* {datas?.map((el,index)=>{
            return(
              <div onClick={()=>handleInserData(el._id)} key={index} className="w-44 mx-6 my-2 rounded-lg  h-[90%] bg-black flex flex-col hover:bg-[#1c1b1b] active cursor-pointer">
              <div onClick={()=>handleRemovePlan(el._id,el.name)} className="w-[90%] h-[20%] ml-1   text-end font-bold text-white">
                X
              </div>
              <div className="w-[100%] h-[80%] text-white flex justify-center items-center font-inter font-semibold">
                {el.name}
              </div>
            </div>
            )
          })} */}

          {/* </div> */}

          <div className="w-[90%] h-5/6 drop-shadow-lg bg-white rounded-lg flex justify-between items-center">
            <p className=" ml-5 font-extrabold sm:text-base text-xs  font-inter text-dark-blue">
              PLAN MANAGEMENT
            </p>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              ADD PLAN
            </button>
          </div>

          {/* <div onClick={()=>navigate('/admin/addPlan')}   className="w-[17%] h-[95%] ml-2 bg-white border border-dark_red cursor-pointer  flex justify-center items-center ">
            <p className=" font-bold  text-dark_red  ">ADD</p>
          </div> */}
        </div>
      )}

      {/* <div  className="w-[100%]  h-[70%]   ">
        <div className="w-full h-[15%]   flex justify-center items-start">
          <p className="font-inter font-extrabold  text-theme-blue sm:text-2xl">
            AVAILABLE PLAN
          </p>
        </div>

        <div className="w-full h-[85%] flex justify-start p-1  overflow-x-auto  no-scrollbar">
          <div className="flex space-x-4 ">
            
            {datas.map((el,index)=>{
              return(
                <div
              key={index}

              className= "ml-5 sm:w-64 w-44 rounded-xl h-[95%] sm:h-[90%] hover:bg-[#000080] drop-shadow-xl  bg-dark-blue mr-2"
            >
              <div className="w-[90%] h-[10%] text-end rounded-full font-bold text-white text-lg">
                X
              </div>
              <div  className=" w-[100%] rounded-xl h-[90%] font-inter     text-white text-lg">
               <div className="flex justify-center w-full  h-[15%] ">
                <p className="sm:text-2xl text-base font-bold">{el.name}</p>

               </div>
               <div className="flex justify-center w-full   h-[20%]">
                <div className="h-full w-1/3  text-center pt-1 sm:text-base text-[9px]">
                <span className="block sm:text-sm text-[10px]">Duration</span>
                  {el.duration}
                </div>
                <div className="h-full w-1/3  text-center pt-1 sm:text-base text-[9px]">
                <span className="block sm:text-sm text-[10px] ">Connect</span>
                  {el.connect}
                </div>
                <div className="h-full w-1/3 text-center pt-1 sm:text-base text-[9px]">
                <span className="block sm:text-sm text-[10px]">Amount</span>
                 {el.amount}
                </div>
               </div>
               <div className="w-full sm:h-36 h-32 text-sm ">
                <ul className="p-2 flex flex-col h-full justify-around  items-center sm:text-[15px] text-[10px]">
                  {el.features.map((elem,indexOfFeatur)=> <li key={indexOfFeatur}>{elem}</li>)}
                  
                  
                </ul>
               </div>
               <div className=" w-full h-[15%] flex justify-center items-end  ">

              <button className="bg-white text-blue-600 w-16 rounded-full text-sm font-serif" >EDIT</button>
               </div>
              </div>
            </div>
              )
            })}
            
            
          </div>
        </div>
      </div> */}
      {/* <div className="w-[100%] h-[70%] bg-slate-600">
        
      </div> */}
    </div>
  );
};




