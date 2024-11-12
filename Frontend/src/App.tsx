import React, { useContext } from "react";
import { Login } from "./admin/Login/Login";
import { Layout } from "./admin/Layout/Layout";
import { Routes,Route} from "react-router-dom";
import { Landing } from "./user/Landing/Landing";
import { SignupContext } from "./GlobalContext/signupData"; 
import { LoginLanding } from "./user/LoginLanding/LogLanding";
import { UserTable } from "./admin/Components/Tables/UserTable/Table";
import { OTPVerification } from "./user/otp verification/OTPVerification";
import { PlanDetails } from "./admin/pages/PlanMa/PlanMgt";
import { ProtectRouteAdmin,PlanRouteUser ,UnProtectRouteUser,UnProtectRouteAdmin,ProtectRouteUser } from "./utils/RouteManagement";
import { AddPlan  } from "./admin/pages/AddPlan/AddPlan";
import PlanPurchase from "./user/plan/Plan"; 





import { Credentials } from "./user/Signup/Credentials";

const districtsOfKerala = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad"
];
const App: React.FC = () => {
    const context=useContext(SignupContext)
   
    if(!context){
      throw new Error('user  data is empty in opt verification')
    }
    // const {signupFirstData}=context

  const inputFields=[
    {linkingName:'firstName',inputType:'text',inputName:'FIRST NAME'},
    {linkingName:'secondName',inputType:'text',inputName:'SECOND NAME'},
    {linkingName:'dateOfBirth',inputType:'date',inputName:'DATE OF BIRTH'},
    {linkingName:'state',inputType:'dropDown',option:districtsOfKerala,inputName:'STATE THAT YOU LIVE'},
    {linkingName:'Gender',inputType:'dropDown',option:['female','male'] ,inputName:"YOUR GENDER"},
    {linkingName:'partner',inputType:'dropDown',option:['male','female'], inputName:"GENDER OF PARTNER"},
    {linkingName:'email',inputType:'email',inputName:"EMAIL"},
    {linkingName:'password',inputType:'password',inputName:"PASSWORD"},
    {linkingName:'cPassword',inputType:'password',inputName:"CONFIRM PASSWORD"},
  ]
  return (
    <Routes>
     <Route element={<UnProtectRouteAdmin/>}>

     
      <Route path="/login" element={<Login />} />
     </Route>
      <Route  element={<ProtectRouteAdmin />} >
      
      <Route path="/admin" element={<Layout />}>
        <Route path="manageUser" element={<UserTable />} />
        <Route path="addPlan" element={<AddPlan/>} />
        <Route path="Plan" element={<PlanDetails />} />
      </Route>
      </Route>
        <Route path="/PlanDetails" element={<PlanRouteUser/>}>
        <Route path="" element={<PlanPurchase />}/>
        </Route>
      <Route element={<UnProtectRouteUser/>}>
      <Route path="/" element={<Landing />} />
      <Route path="/signUp" element={<Credentials inputFields={inputFields} toggle={1} />} />
      <Route path="/photoAdding" element={<Credentials inputFields={inputFields} toggle={2} />} />
      <Route path="/otpVerification" element={<OTPVerification  />}/>
      </Route>
      <Route element={<ProtectRouteUser/>}>
      
      <Route path="/loginLanding" element={<LoginLanding active={'profile'}/>} />
      </Route>
    </Routes>
  );
};

export default App;
