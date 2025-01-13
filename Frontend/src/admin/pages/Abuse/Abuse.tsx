import { ReportModal } from "@/admin/Components/AbuseModalAction/AbuseAction";
import { handleAlert, promptSweet } from "@/utils/alert/sweeAlert";
import { request } from "@/utils/axiosUtils";
import { abuseDateFormat } from "@/utils/dateForAbuse";
import { showToast } from "@/utils/toast";
import { read } from "fs";
import { Trash2, Mail, MailOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface AbuserReport{
  _id:string
  reporter:{_id:string,PersonalInfo:{firstName:string}}
  reported:{_id:string,PersonalInfo:{firstName:string}}
  read:boolean
  reason:string
  moreInfo:string
  warningMail:boolean
  rejected:boolean
  block:boolean
  createdAt:Date
}

export function Abuse() {
const [reports,setReports]=useState<AbuserReport[]>([])
const [isOpen,setIsOpen]=useState<boolean>(false)
const [currentData,setCurrentData]=useState<AbuserReport>({_id:'',rejected:true,block:false,createdAt:new Date,moreInfo:'',read:true,reason:'',reported:{_id:'',PersonalInfo:{firstName:''}},reporter:{_id:'',PersonalInfo:{firstName:''}},warningMail:true})
  useEffect(()=>{
    console.log(reports)
  },[reports])
  useEffect(()=>{
    try {
      async function fetch(){
        const response:{data:AbuserReport[],message:string}=await request({url:'/admin/getReports'})
       
        if(response.message){
          throw new Error(response.message)
        }
        setReports(response.data)
      }
      fetch()
    } catch (error:any) {
      handleAlert('error',error.message||'error on report fetching')
    }
  },[])
  const [messages, setMessages] = useState([
    {
      id: 1,
      subject: "Meeting Tomorrow",
      date: "13:37-25-11-2024",
      isRead: false,
    },
    {
      id: 2,
      subject: "Weekly Report",
      date: "Please review the attached documents",
      isRead: true,
    },
    {
      id: 3,
      subject: "Holiday Schedule",
      date: "Important updates about holiday hours",
      isRead: false,
    },
    {
      id: 4,
      subject: "Holiday Schedule",
      date: "Important updates about holiday hours",
      isRead: false,
    },
    {
      id: 5,
      subject: "Holiday Schedule",
      date: "Important updates about holiday hours",
      isRead: false,
    },
    {
      id: 6,
      subject: "Holiday Schedule",
      date: "Important updates about holiday hours",
      isRead: false,
    },
    {
      id: 7,
      subject: "Holiday Schedule",
      date: "Important updates about holiday hours",
      isRead: false,
    },
  ]);
  const formatTime = (timestamp:Date) => {
    const date = new Date(timestamp);
  const now = new Date();

 
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
 
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else {
 
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  };
  
  ///////////////////////handle modal//////////////////

    function handleLoadDetails(e:React.MouseEvent<HTMLDivElement>,index:number){
     
      setCurrentData(reports[index])
      setIsOpen(true)
    }
  

  const toggleRead =async (id:string,e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    let status=false
    reports.forEach(el=>{
      if(el._id===id){
        status=el.read
      }
    })
      try {
        const response:{status:boolean,message:string}=await request({url:'/admin/reportToggle',method:'patch',data:{status:!status,id:id}})
        if(response.message){
          throw new Error(response.message)
        }

        showToast('updated',"info")
      } catch (error:any) {
       
        throw new Error(error.message)
      }
    
      setReports(el=>el.map(el=>({...el,read:(el._id===id)?!el.read:el.read})))
      
    
    e.stopPropagation()
  };

  const deleteMessage =async (id:string,e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    try{
     await promptSweet(()=>deleteMsg(),'Do you want to delete the message','Message Deleted')
    async  function deleteMsg(){

        const response:{data:boolean,message:string}=await request({url:'/admin/deleteMsg',method:'delete',data:{id:id}})
        if(response.message){
          throw new Error(response.message)
        }
        setReports(messages=>messages.filter((msg) => msg._id !== id));
        
      }
      
    }catch(error:any){
      handleAlert(error.message)
    }
  };
  return (
    <div className="container   pt-16 sm:px-24 ">
      <ReportModal isOpen={isOpen} setOpen={setIsOpen} setReport={setReports} reportData={currentData}/>
      <div className="w-full max-h-[60%] bg-white pb-14 border border-blue-400 rounded-xl overflow-y-auto">
        <div className="p-4 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="space-y-4">
            {reports.map((message,index) => (
              <div
                onClick={(e)=>handleLoadDetails(e,index)}
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105  ${
                  message.read ? "bg-gray-50" : "bg-white border-green-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{message.reason}</h2>
                    <p className="text-gray-600 text-xs">{formatTime(message.createdAt)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => toggleRead(message._id,e)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title={message.read ? "Mark as unread" : "Mark as read"}
                    >
                      {message.read ? (
                        <MailOpen className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Mail className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                    <button
                      onClick={(e) => deleteMessage(message._id,e)}
                      className="p-2 hover:bg-gray-100 rounded-full text-red-600"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
    </div>
    
  );
}
