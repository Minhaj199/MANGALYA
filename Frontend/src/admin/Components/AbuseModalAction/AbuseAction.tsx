import React, { Dispatch, SetStateAction } from "react";

import { AlertCircle, Mail, Ban, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AbuserReport } from "../../pages/Abuse/Abuse";
import { request } from "@/utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import { handleAlert } from "@/utils/alert/sweeAlert";


export const ReportModal = ({
  isOpen = false,
  reportData,
  setOpen,
  setReport
}: {
  isOpen: boolean;
  reportData: AbuserReport;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setReport:Dispatch<SetStateAction<AbuserReport[]>>
}) => {
  const navigate=useNavigate()
  const sampleReport = {
    reporter: "John Doe",
    reported: "Jane Smith",
    subject: "Inappropriate Content",
    message:
      "This content violates community guidelines by containing offensive language.",
    area: "Forum Discussion #123",
  };

  const data = reportData || sampleReport;

  const handleWarningMail =async () => {
    // Implement warning mail logic
    
    try {
      const response:{data:AbuserReport,message:string}=await request({url:'/admin/sendWarningMale',method:'patch',data:{reporter:reportData.reporter._id,reported:reportData.reported._id,docId:reportData._id}})
      if(response.message){
        if(response.message==='validation Faild'){
          navigate('/')
        }
        throw new Error(response.message)
      }
      if(response.data){
        setReport(el=>el.map(elem=>({...elem,read:(elem._id===reportData._id)?true:false,warningMail:(elem._id===reportData._id)?true:false})))
        setOpen(false)
        handleAlert("success",'warning mail send')
      }
    } catch (error:any) {
      handleAlert(error.message||'error on setWarning')
    }
    console.log("Sending warning mail...");
  };

   const handleBlock =async () => {
    // Implement block logic

    try {
      const response:{data:AbuserReport,message:string}=await request({url:'/admin/blockAbuser',method:'patch',data:{reporter:reportData.reporter._id,reported:reportData.reported._id,docId:reportData._id}})
      if(response.message){
        if(response.message==='validation Faild'){
          navigate('/')
        }
        throw new Error(response.message)
      }
      if(response.data){
        setReport(el=>el.map(elem=>({...elem,read:(elem._id===reportData._id)?true:false,block:(elem._id===reportData._id)?true:false})))
        setOpen(false)
        handleAlert("success",' User Blocked')
      }
    } catch (error:any) {
      handleAlert(error.message||'error on setWarning')
    }
   
  };

  const handleReject = async() => {
    // Implement reject logic
    try {
      const response:{data:AbuserReport,message:string}=await request({url:'/admin/rejecReport',method:'patch',data:{reporter:reportData.reporter._id,docId:reportData._id}})
      if(response.message){
        if(response.message==='validation Faild'){
          navigate('/')
        }
        throw new Error(response.message)
      }
      if(response.data){
        setReport(el=>el.map(elem=>({...elem,read:(elem._id===reportData._id)?true:false,rejected:(elem._id===reportData._id)?true:false,block:(elem._id===reportData._id)?true:false,warningMail:(elem._id===reportData._id)?true:false})))
        setOpen(false)
        handleAlert("success",'Request Rejected')
      }
    } catch (error:any) {
      handleAlert(error.message||'error on setWarning')
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Report Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 ">
          <Alert variant="warning" className="bg-yellow-50 flex justify-between items-center  ">
            <div className="w-4 h-4 sm:block hidden ">
            <AlertCircle className="h-full  w-full " />

            </div>
            <AlertDescription className="">
              Please review this report carefully before taking action
            </AlertDescription>
          </Alert>

          <div className="space-y-3 ">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Reporter:</span>
              <span className="col-span-2">{reportData.reporter.PersonalInfo.firstName}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Reported:</span>
              <span className="col-span-2">{reportData.reported.PersonalInfo.firstName}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Subject:</span>
              <span className="col-span-2">{reportData.reason}</span>
            </div>

            <div className="space-y-2  h-40 sm:w-[400px] w-[340px]   ">
              <span className="font-semibold">Message:</span>
              <div className="border rounded p-3 bg-red-50  w-full h-full break-words   overflow-y-auto ">
                {/* {data.moreInfo} */}
                {reportData.reason}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-14">
            <Button
              variant="outline"
              disabled={reportData.warningMail}
              onClick={handleWarningMail}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Warning Mail
            </Button>

            <Button
              variant="destructive"
              onClick={handleBlock}
              disabled={reportData.block}
              className="flex items-center gap-2"
            >
              <Ban className="h-4 w-4" />
              Block
            </Button>

            <Button
              variant="secondary"
              onClick={handleReject}
              disabled={reportData.rejected}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
