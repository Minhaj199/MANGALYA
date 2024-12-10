import React, { useEffect, useRef, useState } from "react";
import { districtsOfKerala } from "../../App";
import "./userProfile.css";
import { CountdownProfile } from "../Components/timer/CountdownProfile";
import { request } from "../../utils/axiosUtils";
import { json, useNavigate } from "react-router-dom";
import { alertWithOk, handleAlert } from "../../utils/alert/sweeAlert";
import { getInputData } from "../../utils/getDateToDateInput";
import { validateEditedData } from "../../Validators/editValidate";
import { capitaliser } from "../../utils/capitalise";


export type userData = {
  PersonalInfo: {
    firstName: string;
    secondName: string;
    state: string;
    gender: string;
    dateOfBirth: string;
    image?: File | string;
    interest?: string[] | null;
    photo: FormData | null;
  };
  partnerData: {
    gender: string;
  };
  email: string;

  subscriber: string;
};
const blanUserData = {
  PersonalInfo: {
    firstName: "",
    secondName: "",
    state: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    interest: null,
    photo: null,
  },
  partnerData: {
    gender: "",
  },
  email: "",

  subscriber: "",
};
export const UserProfile = () => {
  const [editUser, setEditUser] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<userData>(blanUserData);

  ///////////////////////handle between edit and view profile/////////////////////
  const handleTogleBetweenEdit = (action: boolean) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setEditUser(action);
  };
  //////////////////fetching data////////////
  type fetchBlankData = {
    PersonalInfo: {
      firstName: string;
      secondName: string;
      state: string;
      gender: string;
      dateOfBirth: Date
      interest: string[];
      age: number;
      image: string;
    };
    PartnerData: { gender: string };
    Email: string;
    subscriptionStatus: string;
    currentPlan: {
      amount: number;
      connect: number;
      avialbleConnect: number;
      duration: number;
      features: string[];
      name: string;
      Expiry: Date;
    };
  };
  const [orginalData, setOrginalData] = useState<fetchBlankData>({
    PersonalInfo: {
      firstName: "",
      secondName: "",
      state: "",
      gender: "",
      dateOfBirth: new Date(),
      interest: [],
      age: 0,
      image: "",
    },
    PartnerData: { gender: "" },
    Email: "",
    subscriptionStatus: "",
    currentPlan: {
      amount: 0,
      connect: 0,
      avialbleConnect: 0,
      duration: 0,
      features: [],
      name: "",
      Expiry: new Date(),
    },
  });
  interface fetchUerData {
    message: string;
    user: fetchBlankData;
  }

  //////////////set interest////////
  const [interest, setInterest] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData: fetchUerData = await request({
          url: "/user/getUserProfile",
        });
      
        const interest: {
          Data: { food: string[]; music: string[]; sports: string[] };
          message: string;
        } = await request({ url: "/user/getInterest" });
      
        if (interest.Data) {
          setInterest([
            ...interest?.Data.food,
            ...interest.Data.music,
            ...interest.Data.sports,
          ]);
        }
        if (userData.message || interest.message) {
          throw new Error(userData.message);
        }
        setOrginalData(userData.user);
        
      } catch (error: any) {
        alertWithOk(
          "UserData loading",
          error.message || "error on fetch user data",
          "error"
        );
      }
    }
    fetchUserData();
  }, []);
  //////////////////handle change in input data/////////////////
  const handleInputData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "firstName") {
      const value=capitaliser(e.target.value)
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, firstName:value },
      }));
    } else if (e.target.name === "secondName") {
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, secondName: e.target.value },
      }));
    } else if (e.target.name === "district") {
      if (e.target.value !== "")
        setEditedData((el) => ({
          ...el,
          PersonalInfo: { ...el.PersonalInfo, state: e.target.value },
        }));
    } else if (e.target.name === "gender") {
      if (e.target.value !== "")
        setEditedData((el) => ({
          ...el,
          PersonalInfo: { ...el.PersonalInfo, gender: e.target.value },
        }));
    } else if (e.target.name === "dateOfBirth") {
      const inputDate = new Date(e.target.value);
      const formattedDate = inputDate.toISOString().split("T")[0];
      setEditedData((el) => ({
        ...el,
        PersonalInfo: {
          ...el.PersonalInfo,
          dateOfBirth: formattedDate,
        },
      }));
    } else if (e.target.name === "email") {
      setEditedData((el) => ({ ...el, email: e.target.value }));
    } else if (e.target.name === "partnerGender") {
      setEditedData((el) => ({
        ...el,
        partnerData: { ...el.partnerData, gender: e.target.value },
      }));
    } else if (e.target.name === "interest" && e.target.value) {
      if (
        !orginalData.PersonalInfo.interest?.includes(e.target.value) &&
        !editedData.PersonalInfo.interest?.includes(e.target.value)
      )
        setEditedData((el) => ({
          ...el,
          PersonalInfo: {
            ...el.PersonalInfo,
            interest: el.PersonalInfo.interest?.length
              ? [...el.PersonalInfo.interest, e.target.value]
              : el.PersonalInfo.interest === null
              ? [...orginalData.PersonalInfo.interest, e.target.value]
              : [e.target.value],
          },
        }));
    }
  };

  ///////////////handling phoot
  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files;
    if (file?.length) {
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, image: file[0] },
      }));
      const imageUrl = URL.createObjectURL(file[0]);
      setTempPhot(imageUrl);
    }
  }
  //////////////////handle remove interest///////////

  function removeInterest(interest: string) {
    setEditedData((el) => ({
      ...el,
      PersonalInfo: {
        ...el.PersonalInfo,
        interest: el.PersonalInfo.interest?.length
          ? el.PersonalInfo.interest.filter((elem) => elem !== interest)
          : orginalData.PersonalInfo.interest.filter(
              (elem) => elem !== interest
            ),
      },
    }));
  }
  ///////////////////password reset//////////////////

  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [passwords, setPasswords] = useState<{
    password: string;
    confirmPassword: string;
  }>({ password: "", confirmPassword: "" });
  const [switchTopassword, setSwitchTopassword] = useState<boolean>(false);
  const [warnning, setWarning] = useState<string>();
  interface IsValid {
    status: boolean;
    message: string;
  }
  const [PasswordWarnning, setPasswordWarning] = useState<{
    password: string;
    confirmPassword: string;
  }>({ confirmPassword: "", password: "" });
  async function submitPassword() {
    if (passwords.password.trim() === "") {
      setPasswordWarning((el) => ({ ...el, password: "Blank not allowed" }));
      return false;
    } else {
      setPasswordWarning((el) => ({ ...el, password: "" }));
    }
    if (passwords.confirmPassword.trim() === "") {
      setPasswordWarning((el) => ({
        ...el,
        confirmPassword: "Blank not allowed",
      }));
      return false;
    } else {
      setPasswordWarning((el) => ({ ...el, confirmPassword: "" }));
    }
    if (
      passwords.password.trim().length < 5 ||
      passwords.password.trim().length > 10
    ) {
      setPasswordWarning((el) => ({
        ...el,
        password: "Charectors should b/w 5-10",
      }));
      return false;
    } else {
      setPasswordWarning((el) => ({ ...el, password: "" }));
    }
    if (
      passwords.confirmPassword.trim().length < 5 ||
      passwords.confirmPassword.trim().length > 10
    ) {
      setPasswordWarning((el) => ({
        ...el,
        confirmPassword: "Charectors Should b/w 5-10",
      }));
      return false;
    } else {
      setPasswordWarning((el) => ({ ...el, confirmPassword: "" }));
    }
    if (passwords.password !== passwords.confirmPassword) {
      setPasswordWarning({
        password: "Password is not match",
        confirmPassword: "Password is not match",
      });
      return false;
    } else {
      setPasswordWarning({ confirmPassword: "", password: "" });
    }

    try {
      const response: { status: boolean; message: string } = await request({
        url: "/user/resetPassword",
        data: passwords,
        method: "patch",
      });
      if (response.message) {
        throw new Error(response.message || "Error on password reset");
      }
      if (response.status === true) {
        setOpenPopUp(false);
        setOtp(0);
        setEditUser(false);
        handleAlert("success", "Password changed successfully");
      }
    } catch (error: any) {
      alertWithOk(
        "Password Reset",
        error.message || "error on password reset",
        "error"
      );
    }
  }
  async function handleOTPSent() {
    if (!otp || otp <= 0) {
      setWarning("Please enter otp");
      return;
    }
    try {
      const isValid: IsValid = await request({
        url: "/user/validateUserOTP",
        method: "post",
        data: { OTP: otp },
      });
      if (isValid.message) {
        throw new Error(isValid.message || "error on otp validation");
      }
      if (isValid.status) {
        setSwitchTopassword(true);
      } else if (isValid.status === false) {
        alertWithOk("OTP VALIDATION", "validation faild", "info");
      }
    } catch (error: any) {
      alertWithOk(
        "OTP VALIDATION",
        error.message || "validation faild",
        "error"
      );
    }
  }

  function inputPassword(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "password") {
      setPasswords((el) => ({ ...el, password: e.target.value }));
    } else {
      setPasswords((el) => ({ ...el, confirmPassword: e.target.value }));
    }
  }

  const navigate = useNavigate();

  const expiryTimeStamp = new Date(Date.now() + 120000);

  ////////////handle photo change/////
  const profileRef = useRef<HTMLInputElement>(null);
  function handleClick() {
    if (profileRef.current) {
      profileRef.current.click();
    }
  }
  const [tempPhoto, setTempPhot] = useState<string>("");

  function handleRemovePhoto() {
    setTempPhot("");
    setEditedData((el) => ({
      ...el,
      PersonalInfo: { ...el.PersonalInfo, image: "" },
    }));
  }
  useEffect(() => {
    if (openPopUp) {
      async function createOTP() {
        await request({ url: "/user/otpRstPsword", method: "post" });
      }
      createOTP();
    }
  }, [openPopUp]);
  



  ////////////////////////////// handle submit edited data//////////////////////
 
  async function submitEditedData() {
    
    const x=(validateEditedData(editedData))
  
    if(!x){
      setEditedData(blanUserData)
      setTempPhot('')
    }else{
      const formData=new FormData()
      formData.append('file',editedData.PersonalInfo.image||'')
      formData.append('data',JSON.stringify(editedData))
      try {
      const response:{newData:fetchBlankData,message:string}=await request({url:'/user/editProfile',method:'put',data:formData})
      console.log(response)
      if(response.message){
        throw new Error(response.message||'error on updating')
      }
      
      if(response){
        if(response.newData){
          setOrginalData(response.newData)
          handleAlert('success','datas updated')
        }else{
          handleAlert('info','data not updated')
        }
      }else{
        throw new Error('data not updated')
      }
      setEditedData(blanUserData)
      setTempPhot('')
      setEditUser(false)

      } catch (error:any) {
        alertWithOk('Update Error',error.message||'error on updata',"error")
      }
    }
  }
  return (
    <div className='flex  items-center flex-col   h-[1100px] bg-gradient-to-b from-theme-blue to-white theme-blue [--tw-gradient-stops:from-theme-blue,via-theme-blue-30%,to-white]"'>
      {/* //////////////////passowordModal//////////////// */}
      {openPopUp && (
        <div className="w-full h-screen  z-[2] fixed flex justify-center items-center">
          <div className="sm:w-[40%] w-[60%] h-[50%] shadow shadow-dark-blue bg-white rounded-xl flex flex-col  items-center">
            <div className="w-full h-8  flex rounded-xl justify-end items-center px-4">
              <p
                onClick={() => (
                  setOpenPopUp(false),
                  setSwitchTopassword(false),
                  setWarning("")
                )}
                className=" cursor-pointer font-bold text-theme-blue"
              >
                X
              </p>
            </div>
            <div className="w-full h-10   flex justify-center items-center">
              <p className="font-acme font-semibold sm:text-2xl text-sm text-theme-blue">
                RESET PASSWORD
              </p>
            </div>

            {/* /////////////////////////passowrd part////////////////// */}
            {!switchTopassword ? (
              <>
                <div className="w-full h-10   mt-3 flex justify-center items-center">
                  <p className="font-acme sm:text-base text-xs  text-theme-blue">
                    ENTER OTP
                  </p>
                </div>
                <div className="w-full h-16  mt-2 flex justify-center items-center">
                  <div className="sm:w-36 w-20 sm:h-14 h-10 border border-theme-blue">
                    <input
                      onChange={(t) => setOtp(parseInt(t.target.value))}
                      min={1}
                      max={1000000}
                      type="number"
                      className="h-full w-full px-2 outline-none text-center text-dark-blue "
                    />
                  </div>
                </div>
                <div className="sm:w-36 w-28 sm:h-6 h-5  text-center text-dark-blue">
                  {warnning && warnning}
                </div>
                <div className="sm:w-36 text-theme-blue font-bold w-28 mt-1 sm:h-10 h-8  inline-flex justify-between">
                  {openPopUp === true && (
                    <CountdownProfile
                      expiryTimeStamp={expiryTimeStamp}
                      from="userProfile"
                    />
                  )}
                </div>
                <div className="sm:w-36 w-28 mt-2 sm:h-10 h-8 flex justify-center items-center ">
                  <button
                    onClick={handleOTPSent}
                    className="cursor-pointer relative group  overflow-hidden border-2 sm:px-8 px-4 sm:py-1 border-theme-blue"
                  >
                    <span className="font-bold text-white  relative z-10 group-hover:text-theme-blue duration-500">
                      SUBMIT
                    </span>
                    <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:-translate-x-full h-full"></span>
                    <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-x-full h-full"></span>

                    <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
                    <span className="absolute delay-300 top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-y-full h-full"></span>
                  </button>
                </div>
              </>
            ) : (
              ///////////////////////// passsword Typing part/////////////////////////////
              <div className="w-[95%] mt-5 h-[55%]   flex    items-center flex-col">
                <div className="w-[60%]   flex  flex-col justify-between h-[45%] ">
                  <label
                    htmlFor=""
                    className="text-theme-blue font-bold sm:text-base text-sm"
                  >
                    PASSWORD
                  </label>
                  <div className="mb-2 h-10 w- border border-theme-blue">
                    <input
                      onChange={inputPassword}
                      name="password"
                      className="w-full h-full text-gray-800 px-2"
                      type="text"
                    />
                  </div>
                  <div className="w-full h-6  text-dark_red sm:text-base text-xs">
                    {PasswordWarnning.password}
                  </div>
                </div>
                <div className="w-[60%] mt-2  flex  flex-col justify-between h-[45%] ">
                  <label
                    className="text-theme-blue font-bold sm:text-base text-sm"
                    htmlFor=""
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div className="mb-2 h-10 w- border border-theme-blue">
                    <input
                      name="confirmPassword"
                      onChange={inputPassword}
                      className="w-full h-full px-2 text-gray-800 "
                      type="password"
                    />
                  </div>
                  <div className="w-full h-6 text-dark_red sm:text-base text-xs ">
                    {PasswordWarnning.confirmPassword}
                  </div>
                </div>
                <div className="sm:w-[100%] w-28  mt-2 sm:h-10 h-8 flex justify-center items-center ">
                  <button
                    onClick={submitPassword}
                    className="cursor-pointer relative group  overflow-hidden border-2 sm:px-8 px-4 sm:py-1 border-theme-blue"
                  >
                    <span className="font-bold text-white  relative z-10 group-hover:text-theme-blue duration-500">
                      RESET
                    </span>
                    <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:-translate-x-full h-full"></span>
                    <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-x-full h-full"></span>

                    <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
                    <span className="absolute delay-300 top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-y-full h-full"></span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* \\\\\\\\\\\\\\\\\nav\\\\\\\\\\\\\\\\\\\\\\ */}
      <div className="w-full h-[100px] flex items-center bg-[#318bf7]  justify-between px-2 fixed top-0 left-0 z-[1] right-0 ">
        <div className="w-40 h-[50%] ">
          <img
            src="./logo-no-background.png"
            className="w-full h-full"
            alt=""
          />
        </div>
        <div className="w-30 h-[40%]  flex justify-center">
          <button
            onClick={() => navigate("/loginLanding")}
            className="relative py-2 px-8 text-black text-base font-bold nded-full overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0"
          >
            BACK
          </button>
        </div>
      </div>

      <div className="sm:w-[70%] w-[80%] md:w-[60%] mt-36 min-h-auto  rounded-3xl drop-shadow-2xl bg-white">
        <div className="w-full h-[75px] flex justify-center items-center rounded-full ">
          <p className="font-serif text-3xl text-dark-blue">PROFILE</p>
        </div>
        <div className="w-full h-20  flex items-center px-3">
          {/* /////////////////////backbutton////////////////////////// */}
          {editUser && (
            <div
              className="w-8 h-8 rounded-full cursor-pointer  "
              onClick={() => (
                setEditedData(blanUserData), handleTogleBetweenEdit(false)
              )}
            >
              <img
                src="./backForProfile.png"
                className="w-full h-full"
                alt=""
              />
            </div>
          )}
        </div>
        {/* //////////////////////disply photo//////////////////////  */}
        <div className="flex justify-center items-center w-full h-[175px]  ">
          <div className="w-36 h-36 rounded-full bg-green-500">
            <input
              type="file"
              ref={profileRef}
              name="photo"
              onChange={handleFileInput}
              className="hidden"
              accept="image/*"
            />
            <img
              className="w-full  h-full rounded-full"
              src={
                tempPhoto ||
                orginalData.PersonalInfo?.image ||
                "./photoUpload.png"
              }
              alt=""
            />
            {editUser && (
              <div>
                {tempPhoto ? (
                  <div
                    onClick={handleRemovePhoto}
                    className="w-8 h-8 left-24 bottom-6 rounded-full cursor-pointer  relative"
                  >
                    <img
                      src="./deleteRemove.png"
                      className="w-full h-full"
                      alt=""
                    />
                  </div>
                ) : (
                  <div
                    onClick={handleClick}
                    className="w-8 h-8 left-24 bottom-6 rounded-full cursor-pointer relative"
                  >
                    <img src="./pen.png" className="w-full h-full" alt="" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-auto w-full grid p-4 sm:grid-cols-2 grid-cols-1  gap-2">
          {/* ///////////////////////Personal data///////////////////////// */}
          <div className="sm:w-[90%] w-[99%]  h-[400px] shadow-md  shadow-theme-blue   rounded-3xl">
            <div className="w-full h-12  justify-center   flex items-center rounded-full">
              <p className="font-raleway font-bold text-[#1a27a1]">
                Personal Details
              </p>
            </div>
            <div className="w-[100%] px-2 py-4 h-[250px]  ">
              <ul className="font-roboto grid gap-y-4 text-sm">
                <li>
                  {" "}
                  <span className="font-medium text-gray-500">NAME:</span>
                  {editUser ? (
                    <span className="ml-2 ">
                      <input
                        value={
                          editedData.PersonalInfo?.firstName ||
                          orginalData.PersonalInfo.firstName
                        }
                        name="firstName"
                        onChange={handleInputData}
                        className="px-2 text-gray-800 outline-none border border-[#a3a3f7]"
                        type="text"
                      />
                    </span>
                  ) : (
                    <span className="ml-10 text-gray-800">
                      {orginalData.PersonalInfo.firstName}
                    </span>
                  )}{" "}
                </li>
                <li>
                  {" "}
                  <span className="font-medium text-gray-500">SEC.NAME:</span>
                  {editUser ? (
                    <span className="sm:ml-2">
                      <input
                        value={
                          editedData.PersonalInfo?.secondName ||
                          orginalData.PersonalInfo.secondName
                        }
                        name="secondName"
                        onChange={handleInputData}
                        className="px-2 text-gray-800 outline-none border border-[#a3a3f7]"
                        type="text"
                      />
                    </span>
                  ) : (
                    <span className="ml-4 text-gray-800">
                      {orginalData.PersonalInfo.secondName}
                    </span>
                  )}
                </li>
                <li>
                  {" "}
                  <span className="font-medium text-gray-500">DST:</span>{" "}
                  {editUser ? (
                    <select
                      className="outline-none border text-sm  text-gray-800"
                      name="district"
                      onChange={handleInputData}
                      value={
                        editedData.PersonalInfo.state
                          ? editedData.PersonalInfo.state
                          : orginalData.PersonalInfo.state
                      }
                      id=""
                    >
                      {districtsOfKerala.map((el, index) => {
                        return (
                          <option
                            className="text-dark-blue"
                            key={index}
                            value={el}
                          >
                            {el}
                          </option>
                        );
                      })}
                      <option value=""></option>
                    </select>
                  ) : (
                    <span className="ml-10 text-gray-800">
                      {orginalData.PersonalInfo.state}
                    </span>
                  )}
                </li>
                <li>
                  {" "}
                  <span className="font-medium text-gray-500">GENDER:</span>
                  {editUser ? (
                    <span className="ml-5 text-gray-800">
                      <select
                        name="gender"
                        className="outline-none border text-sm ml-2  text-gray-800"
                        value={
                          editedData.PersonalInfo.gender ||
                          orginalData.PersonalInfo.gender
                        }
                        onChange={handleInputData}
                        id=""
                      >
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                    </span>
                  ) : (
                    <span className="ml-5 text-gray-800">
                      {orginalData.PersonalInfo.gender}
                    </span>
                  )}
                </li>
                <li>
                  {" "}
                  <span className="font-medium text-gray-500">DOB:</span>
                  {editUser ? (
                    <input
                      name="dateOfBirth"
                      value={
                        editedData.PersonalInfo.dateOfBirth ||
                        getInputData(orginalData.PersonalInfo.dateOfBirth)
                      }
                      onChange={handleInputData}
                      className="text-gray-800 ml-2"
                      type="date"
                    />
                  ) : (
                    <span className="ml-10 text-gray-800">
                      {getInputData(orginalData.PersonalInfo.dateOfBirth)}
                      {` (${orginalData.PersonalInfo.age} age)`}
                    </span>
                  )}
                </li>
                <li>
                  <span className="font-medium text-gray-500">EMAIL:</span>{" "}
                  {editUser ? (
                    <input
                      value={editedData.email || orginalData.Email}
                      name="email"
                      onChange={handleInputData}
                      className="px-2 text-gray-800 outline-none border border-[#a3a3f7]"
                      type="email"
                    />
                  ) : (
                    <span className="ml-5 text-gray-800">
                      {orginalData.Email}
                    </span>
                  )}{" "}
                </li>
              </ul>
            </div>
            <div className="w-full h-[20%]  justify-center items-center flex">
              {editUser && (
                <button
                  onClick={() => setOpenPopUp(true)}
                  className="relative   px-4 py-1 rounded-md bg-white isolation-auto z-10 
                border-2 border-theme-blue before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-theme-blue before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 inline-flex items-center justify-center px-4 py-1 text-sm font-semibold text-black bg-white border border-gray-200 rounded-lg shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  change passoword
                </button>
              )}
            </div>
          </div>
          {/* //////////////////////subscription Data/////////////////////// */}
          <div className="sm:w-[90%] w-[99%]  h-[400px] shadow-md  shadow-theme-blue   rounded-3xl">
            <div className="w-full h-12  justify-center   flex items-center rounded-full">
              <p className="font-raleway font-bold text-[#1a27a1]">
                Subscription Details
              </p>
            </div>
            <div className="w-[100%] px-2  py-4 h-[200px] ">
              {orginalData.currentPlan?.name? (
                <ul className="font-roboto grid gap-y-4 text-sm break-keep">
                  <li>
                    <span className="font-medium text-gray-500">STATUS:</span>
                    <span className="ml-2 text-gray-800">
                      {orginalData.subscriptionStatus}
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                    <span className="font-medium text-gray-500">
                      NAME:
                    </span>{" "}
                    <span className="ml-2 text-gray-800">
                      {orginalData.currentPlan.name}
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                    <span className="font-medium text-gray-500">
                      AMOUNT:
                    </span>{" "}
                    <span className="ml-2 text-gray-800">
                      {orginalData.currentPlan.amount}
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                    <span className="font-medium text-gray-500">
                      CONNECT:
                    </span>{" "}
                    <span className="ml-1 text-gray-800">
                      {orginalData.currentPlan.connect}
                    </span>{" "}
                  </li>
                  <li className="inline-flex">
                    {" "}
                    <span className="font-medium text-gray-500 ">
                      Feature
                    </span>{" "}
                    <span className="ml-10 text-gray-800">
                      <ol type="1" className=" break-keep">
                        {orginalData.currentPlan.features?.map((el, index) => {
                          return <li key={index}>{el}</li>;
                        })}
                      </ol>
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                    <span className="font-medium text-gray-500">
                      Expiry:
                    </span>{" "}
                    <span className="ml-5 text-gray-800">
                      {new Date(orginalData.currentPlan.Expiry).toDateString()}
                    </span>{" "}
                  </li>
                </ul>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="font-acme md:text-2xl text-theme-blue">
                    NO PLAN
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* ////////////////////partner details///////////////////// */}
          <div
            className={
              editUser
                ? "sm:w-[90%] w-[100%]   h-[300px] shadow-md  shadow-theme-blue   rounded-3xl"
                : "sm:w-[90%] w-[100%]   h-[200px] shadow-md  shadow-theme-blue   rounded-3xl"
            }
          >
            <div className="w-full h-12  justify-center   flex items-center rounded-full">
              <p className="font-raleway font-bold text-[#1a27a1]">
                Partner Details
              </p>
            </div>
            <div className="w-[100%] px-2 py-4 h-[200px] ">
              <ul className="font-roboto  text-sm">
                <li>
                  <span className="font-medium text-gray-500">GENDER:</span>
                  {editUser ? (
                    <span className="sm:ml-10 text-gray-800">
                      <select
                        value={
                          editedData.partnerData.gender ||
                          orginalData.PartnerData.gender
                        }
                        onChange={handleInputData}
                        name="partnerGender"
                        className="outline-none border  border-[#a3a3f7]"
                      >
                        <option value="">Gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                    </span>
                  ) : (
                    <span className="ml-10 text-gray-800">
                      {orginalData.PartnerData.gender}
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* //////////////////////////////interest datatil////////////////////////////// */}
          <div
            className={
              editUser
                ? "sm:w-[90%] w-[99%]  h-[300px] shadow-md  shadow-theme-blue   rounded-3xl"
                : "sm:w-[90%] w-[99%]  h-[200px] shadow-md  shadow-theme-blue   rounded-3xl"
            }
          >
            <div className="w-full h-12  justify-center   flex items-center rounded-full">
              <p className="font-raleway font-bold text-[#1a27a1]">
                Interest Details
              </p>
            </div>
            {editUser && (
              <div className="w-full h-[20%]  flex items-center">
                <select
                  onChange={handleInputData}
                  disabled={
                    (orginalData?.PersonalInfo.interest.length ?? 0) >= 5 ||
                    (editedData?.PersonalInfo.interest?.length ?? 0) >= 5
                  }
                  className="mx-2 outline-none border border-theme-blue "
                  name="interest"
                >
                  {interest.map((el, index) => {
                    return (
                      <option key={index} value={el}>
                        {el}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            <div className=" w-[98%] ml-1 px-2 py-4 ] grid grid-cols-2  rounded-3xl h-[150px]  ">
              {editedData.PersonalInfo.interest !== null
                ? editedData.PersonalInfo.interest?.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className=" text-sm w-28 h-8 rounded-full border flex   font-roboto font-bold text-gray-800 items-center border-theme-blue"
                      >
                        <div className="rounded-3xl h-full w-[80%]  flex justify-center items-center">
                          {el}
                        </div>
                        {editUser ? (
                          <div
                            onClick={() => removeInterest(el)}
                            className="rounded-3xl cursor-pointer h-[60%] w-[15%] "
                          >
                            <img
                              src="./minus-button.png"
                              className="w-full h-full"
                              alt=""
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })
                : orginalData.PersonalInfo.interest.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className=" text-sm w-28 h-8 rounded-full border flex   font-roboto font-bold text-gray-800 items-center border-theme-blue"
                      >
                        <div className="rounded-3xl h-full w-[80%]  flex justify-center items-center">
                          {el}
                        </div>
                        {editUser ? (
                          <div
                            onClick={() => removeInterest(el)}
                            className="rounded-3xl cursor-pointer h-[60%] w-[15%] "
                          >
                            <img
                              src="./minus-button.png"
                              className="w-full h-full "
                              alt=""
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        <div className=" w-full h-20  flex items-center justify-center rounded-full">
          {editUser ? (
            <button
              onClick={() => (
                handleTogleBetweenEdit(false), submitEditedData()
              )}
              className="overflow-hidden relative w-32 p-2 h-10 bg-dark-blue text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
            >
              Submit
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-theme-blue rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-theme-blue rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-9 z-10">
                DATA
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleTogleBetweenEdit(true)}
              className="overflow-hidden relative w-32 p-2 h-10 bg-dark-blue text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
            >
              UPDATE
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-theme-blue rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-theme-blue rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-9 z-10">
                DATA
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
