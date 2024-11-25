import  { useEffect, useState } from "react";
import "./Plan.css";
import { request } from "../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import { alertWithOk, handleAlert, promptSweet } from "../../utils/alert/sweeAlert";
import { Loading } from "../Components/Loading/Loading";
import { useSelector } from "react-redux";
import { ReduxState } from "../../Redux/ReduxGlobal";


export type PlanData={
  name:string
  connect:number
  duration:number
  features:string[]
  amount:number
  avialbleConnect?:number
  _id:string
}
const PlanPurchase = () => {
  // const [exchangeRate,setExchangeRate]=useState(80)
  // useEffect(()=>{
  //   async function findExchange(){
  //     const  rate=await fetchINRtoUSDRate()
  //     alert(rate)
  //     setExchangeRate(rate)
  //   }
  //   findExchange()
  // },[])
  
  
  
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false)
  const [selected,setSelected]=useState({_id:'',amount:0,duration:0,features:[''],connect:0,name:''})
  const [planData,setPlanData]=useState<PlanData[]>([{_id:'',amount:0,duration:0,features:[''],connect:0,name:''}])
 
 
 ///////////fetching plan
  useEffect(()=>{
   async function fetchPlanData(){
    const response:typeof planData=await request({url:'/user/fetchPlanData'})
    
    setPlanData(response)
   }
   fetchPlanData()
   
  },[])
  const userData=useSelector((state:ReduxState)=>state.userData) 

  ////handing skiping
  console.log(userData)
  function handleSkip(){
    if(localStorage.getItem('userToken')){
      navigate('/loginLanding')
    }else{
      navigate('/')
    }
    
  }
 async function handlePurchase(planInfo:PlanData){
  setLoading(true)
    if(localStorage.getItem('userToken')){
      await promptSweet(Purchase,`Are you sure to subscribe ${planInfo.name} worth ₹${planInfo.amount} ?`,`${planInfo.name} successfully Placed`,handleCancelLoading )
      async function Purchase(){
        
        try {
          const response:{status:boolean,message:string}=await request({url:'/user/purchasePlan',method:'post',data:{id:localStorage.getItem('id'),planData:planInfo}})
        
          if(response.status===true){
            setTimeout(() => {
              localStorage.setItem('subscriptionStatus','subscribed')
              navigate('/')
              handleAlert('success','Plan purchased')
            }, 2000);
          }else{
            setLoading(false)
            throw new Error(response.message||'Error on puchase')
          }
        } catch (error:any) {
          setLoading(false)
          alertWithOk('Plan Purchase',error.message||'Error on purchase',"warning")
        }
      }
     async function handleCancelLoading(){

        setLoading(false)
      }
    }else{
      setLoading(false)
      alertWithOk('Subscription Plan','You have to login first',"info")
    }
  }
  return (
      <div className="h-svh w-screen flex items-center flex-col bg-blue-400 ">
       
       { loading ?
        <Loading/>
        
        : (
          <>
            
          <h1 className="text-white text-xl sm:text-5xl mt-10 font-italian">
            PLEASE JOIN OUR FAMILY
          </h1>
          <p className="text-white sm:text-base text-xs">
            Please take an attractive plan for you and enhance your Profile
          </p>
          <div className="w-screen h-14 flex justify-end items-center px-2 ">
            <p className="text-white cursor-pointer" onClick={handleSkip}>{"DO IT LATER>"}</p>
          </div>
          <div className="w-[80%] px-4 overflow-x-auto no-scrollbar no-scrollbarh-[70%] flex justify-center items-center">
            <div className="flex sm:flex-col md:flex-col lg:flex-row flex-col gap-5 h-full ">
              {planData.map((el, index) => (
                <div key={index} className="sm:w-[300px] w-[250px]  h-[98%] ml-5 rounded-2xl bg-blue-950 " >
                  <div className="w-full h-[13%] flex justify-center items-center">
                    <p className="text-white font-bold font-inter">{`${el.name} : ${el.duration} month`} </p>
                  </div>
                  <div className="w-full h-[18%] flex justify-center items-center flex-col">
                    <p className="text-white text-2xl font-bold">{`₹ ${el.amount}`}</p>
                    <p className="text-white">{`${(el.amount / el.duration).toFixed(0)}/month`}</p>
                  </div>
                  <div className="w-[80%] h-[50%] ml-10 flex py-10 flex-col">
                    <p className="inline-flex mb-2 text-white items-center">
                      <img src="./check-mark.png" className="w-8 h-8" alt="" />UP TO {el.connect} connects
                    </p>
                    {el.features.map((elem, idx) => (
                      <p key={idx} className="inline-flex mb-2 text-white items-center">
                        <img src="./check-mark.png" className="w-8 h-8" alt="" />{elem}
                      </p>
                    ))}
                  </div>
                  <div className="w-full h-20 flex justify-center items-center">
                    <button id="pay" onClick={() => handlePurchase(el)} className="border px-10 py-1 rounded-xl text-white bg-dark-blue">
                      BUY
                    </button>
                   
                   
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
        )}
      </div>
  );
  
};

export default PlanPurchase;
