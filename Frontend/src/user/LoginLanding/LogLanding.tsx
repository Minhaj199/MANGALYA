import React, { useEffect, useState } from "react";
import { request } from "../../utils/axiosUtils";

import "./LogLanding.css";
import { Navbar } from "../Components/User/navbar/Navbar";
import {
  alertWithOk,
  handleAlert,
  simplePropt,
} from "../../utils/alert/sweeAlert";
import { PlanData } from "../plan/Plan";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../../Redux/ReduxGlobal";
import { districtsOfKerala } from "../../App";

type profileType = {
  _id: string;
  interest: string[];
  photo: string;
  lookingFor: string;
  name: string;
  no: number;
  secondName: string;
  state: string;
  age: number;
  gender: string;
  dateOfBirth: Date | string;
};

export const LoginLanding = ({ active }: { active: string }) => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<PlanData | null>(null);

  const [requestProfile, setRequest] = useState<profileType[]>([
    {
      _id: "",
      age: 0,
      gender: "",
      interest: [],
      lookingFor: "",
      name: "",
      no: 0,
      photo: "./defualtImage.jpg",
      secondName: "",
      state: "",
      dateOfBirth: "",
    },
  ]);

  ///////////////////accept request

  const acceptRequest = async (id: string) => {
    try {
      if (planData?.name) {
        const response = await request({
          url: "/user/manageReqRes",
          method: "patch",
          data: { id: id, action: "accept" },
        });

        if (typeof response === "object") {
          handleAlert("success", "Request accepted");
          setRequest((el) => el.filter((el) => el._id !== id));
        } else {
          throw new Error("error on requeset");
        }
      } else {
        alertWithOk("Plan subscription", "No valid plan", "info");
      }
    } catch (error: any) {
      alertWithOk("Plan insertion", error || "Error occured", "error");
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      if (planData?.name) {
        const response = await request({
          url: "/user/manageReqRes",
          method: "patch",
          data: { id: id, action: "reject" },
        });

        if (typeof response === "object") {
          handleAlert("warning", "Request rejected");
          setRequest((el) => el.filter((el) => el._id !== id));
        } else {
          throw new Error("error on requeset");
        }
      } else {
        alertWithOk("Plan subscription", "No valid plan", "info");
      }
    } catch (error: any) {
      alertWithOk("Plan insertion", error || "Error occured", "error");
    }
  };

  ///////////handle matching
  const dispatch = useDispatch();

  const handleMatch = async (
    id: string,
    e?: React.MouseEvent<HTMLImageElement>
  ) => {
    if(e){
      e.stopPropagation();
    }
    alert("match");
    if (planData) {
      if (planData.avialbleConnect && planData.avialbleConnect > 0) {
        try {
          const response: boolean = await request({
            url: "/user/addMatch",
            method: "post",
            data: { matchId: id },
          });
          if (response === true) {
            setPlanData((el) => {
              if (!el) return null;
              return {
                ...el,
                avialbleConnect: el.avialbleConnect
                  ? el.avialbleConnect - 1
                  : el.amount,
              };
            });
            setProfiles((el) => el?.filter((element) => element._id !== id));
          }
        } catch (error) {}
      } else {
        dispatch({
          type: "SET_DATA",
          payload: { ...useData, subscriptionStatus: "connection finished" },
        });
        alertWithOk(
          "Plan subscription",
          "You connection count finished please subscribe",
          "info"
        );
        simplePropt(
          () => navigate("/PlanDetails"),
          "Do you want purchase new Plan"
        );
      }
    } else {
      alertWithOk("Plan subscription", "No valid plan", "info");
    }
  };
  const [profils, setProfiles] = useState<profileType[]>([]);
  const useData = useSelector((state: ReduxState) => state.userData);
  ////////pagination

  const [interest, setInterest] = useState<string[]>();
  //////////profile and plan fetching///////
  useEffect(() => {
    async function fetch() {
      const response: {
        datas: profileType[];
        currntPlan: PlanData;
        interest: string[];
      } = await request({
        url: `/user/fetchProfile`,
      });
      setInterest(response.interest);

      const res: any = response.datas ?? { profile: [], request: [] };

      if (res[0]?.profile) setProfiles(res[0].profile);
      if (res[0]?.request) setRequest(res[0]?.request);
      if (
        response.currntPlan &&
        typeof response.currntPlan === "object" &&
        Object.keys(response.currntPlan).length
      ) {
        setPlanData(response.currntPlan);
      }
    }
    fetch();
  }, []);

  /////////////pagination
  const [totalPage, setTotalPage] = useState(0);
  const itemPerPage = 9;
  const [currentPage, setCurrenPage] = useState(1);
  const [currentData, setCurrentData] = useState<profileType[] | undefined>([]);

  //////////scroll pagination
  const handlePreviouse = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentPage > 1) setCurrenPage((el) => el - 1);
  };
  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentPage < totalPage) setCurrenPage((el) => el + 1);
  };
  ///////search////////////
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<{
    minAge: number;
    maxAge: number;
    district: string;
    interest: string[];
  }>({ minAge: 18, maxAge: 60, district: "", interest: [] });
  let minAge: number[] = [];
  for (let i = 18; i < 60; i++) {
    minAge.push(i);
  }
  let maxAge: number[] = [];
  for (let i = 19; i < 61; i++) {
    maxAge.push(i);
  }
  function openSearchModalFunc() {
    setOpenSearch(true);
  }
  async function resetProfilePage() {
    const response: {
      datas: profileType[];
      currntPlan: PlanData;
      interest: string[];
      massage: string;
    } = await request({
      url: `/user/fetchProfile`,
    });
    if (response.massage) {
      localStorage.removeItem("id");
    }
    const res: any = response.datas ?? { profile: [], request: [] };
    if (res[0]?.profile) setProfiles(res[0].profile);
  }
  function handleInterest(e: React.ChangeEvent<HTMLSelectElement>) {
    if (
      !searchData.interest.includes(e.target.value) &&
      e.target.value !== ""
    ) {
      setSearchData((el) => ({
        ...el,
        interest: [...el.interest, e.target.value],
      }));
    }
  }
  function handleClose(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setSearchData({ minAge: 18, maxAge: 60, district: "", interest: [] });
      setOpenSearch(false);
    }
  }
  function handleChild(e: React.MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
  }
  function removeInterest(index: number) {
    if (interest) {
      setSearchData((el) => ({
        ...el,
        interest: el.interest.filter((el) => el !== searchData.interest[index]),
      }));
    }
  }
  async function handleSearch() {
    if (searchData.maxAge < searchData.minAge) {
      alertWithOk(
        "Search Details",
        "Please provide a valid age range",
        "warning"
      );
      return;
    }
    const response: {
      datas: profileType[];
      currntPlan: PlanData;
      interest: string[];
    } = await request({
      url: `/user/fetchProfile`,
    });
    const res: any = response.datas ?? { profile: [], request: [] };
    if (res[0]?.profile) setProfiles(res[0].profile);
    if (searchData.district && searchData.interest.length !== 0) {
      const profile = profils.filter((el) => {
        return (
          searchData.minAge <= el.age &&
          searchData.maxAge >= el.age &&
          el.state === searchData.district &&
          el.state &&
          searchData.interest.every((interest) =>
            el.interest.includes(interest)
          )
        );
      });
      if (!profile.length) {
        alertWithOk("search result", "no result found", "warning");
        return;
      }
      setProfiles(profile);
    } else if (!searchData.district && searchData.interest.length === 0) {
      const profile = profils.filter((el) => {
        return searchData.minAge <= el.age && searchData.maxAge >= el.age;
      });
      if (!profile.length) {
        alertWithOk("search result", "no result found", "warning");
        return;
      }
      setProfiles(profile);
    } else if (searchData.district) {
      const profile = profils.filter((el) => {
        return (
          searchData.minAge <= el.age &&
          searchData.maxAge >= el.age &&
          searchData.district === el.state
        );
      });
      if (!profile.length) {
        alertWithOk("search result", "no result found", "warning");
        return;
      }
      setProfiles(profile);
    } else if (searchData.interest.length !== 0) {
      const profile = profils.filter((el) => {
        return (
          searchData.minAge <= el.age &&
          searchData.maxAge >= el.age &&
          searchData.interest.every((interest) =>
            el.interest.includes(interest)
          )
        );
      });
      if (!profile.length) {
        alertWithOk("search result", "no result found", "warning");
        return;
      }
      setProfiles(profile);
    }

    setSearchData({ minAge: 18, maxAge: 60, district: "", interest: [] });
    setOpenSearch(false);
  }

  useEffect(() => {
    if (profils?.length) {
      const total = Math.ceil(profils.length / itemPerPage);
      setTotalPage(total);
      if (currentPage > total) {
        setCurrenPage(total);
      } else {
        const sliceData = profils.slice(
          (currentPage - 1) * itemPerPage,
          currentPage * itemPerPage
        );
        setCurrentData(sliceData);
      }
    } else {
      console.log(typeof profils[0]?.age);
      setTotalPage(0);
      setCurrentData([]);
    }
  }, [profils, currentPage, itemPerPage]);

  ////////////////////////handle show profile//////////////////////
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [partnerProfile,setParternProfile]=useState<profileType>(  {
    _id: "",
    age: 0,
    gender: "",
    interest: [],
    lookingFor: "",
    name: "",
    no: 0,
    photo: "./defualtImage.jpg",
    secondName: "",
    state: "",
    dateOfBirth: "",
  })
  function handleShowProfile(e: React.MouseEvent<HTMLDivElement>,profile:profileType) {
    e.stopPropagation();
    setParternProfile(profile)
    if(partnerProfile._id!==''){
      setShowProfile(true);
    }
  }

  return (
    <div className="min-h-[700px]   w-[100%] bg-slate-200 ">
      {/* ////////////////////////////search///////////////////////////// */}
      {openSearch && (
        <div
          onClick={(e) => handleClose(e)}
          className="w-full h-full  flex justify-center items-center fixed  z-10"
        >
          <div
            onClick={(e) => handleChild(e)}
            className="sm:w-[40%] sm:h-[80%] w-[80%] h-[70%] bg-theme-blue rounded-3xl"
          >
            <div className="w-full h-[20%] flex justify-center items-center">
              <p className="text-white text-2xl font-popin">SEARCH</p>
            </div>
            <div className=" items-center w-full h-[60%]   flex-col flex justify-evenly ">
              <div className="w-[70%]  flex  text-white font-medium font-popin h-[15%] ">
                <div className="w-[60%] flex items-center">
                  <p className="font-bold">Age</p>
                </div>
                <div className="w-[40%]  flex justify-evenly items-center">
                  <select
                    value={searchData.minAge}
                    onChange={(t) =>
                      setSearchData((el) => ({
                        ...el,
                        minAge: parseInt(t.target.value),
                      }))
                    }
                    className=" outline-none h-10 w-10 text-gray-600"
                    name=""
                    id=""
                  >
                    {minAge.map((el, index) => (
                      <option key={index}>{el}</option>
                    ))}
                  </select>
                  <p className="">TO</p>
                  <select
                    value={searchData.maxAge}
                    onChange={(t) =>
                      setSearchData((el) => ({
                        ...el,
                        maxAge: parseInt(t.target.value),
                      }))
                    }
                    className=" outline-none h-10 w-10 text-gray-600"
                  >
                    {maxAge.map((el, index) => (
                      <option key={index}>{el}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-[70%]   flex  text-white font-medium font-popin h-[15%] ">
                <div className="w-[40%] flex items-center">
                  <p className="font-bold">District</p>
                </div>
                <div className="w-[60%]  flex justify-end items-center">
                  <select
                    onChange={(t) =>
                      setSearchData((el) => ({
                        ...el,
                        district: t.target.value,
                      }))
                    }
                    className="text-slate-700 outline-none h-8"
                    name=""
                    id=""
                  >
                    <option value="">District</option>
                    {districtsOfKerala.map((el, index) => (
                      <option key={index}>{el}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-[70%]  flex  text-white font-medium font-popin h-[15%] ">
                <div className="w-[40%] flex items-center">
                  <p className="font-bold">Interest</p>
                </div>
                <div className="w-[60%]  flex justify-end items-center">
                  <select
                    disabled={searchData.interest?.length === 3 ? true : false}
                    onChange={(t) => handleInterest(t)}
                    className="text-slate-700 outline-none w-[75%] h-8"
                    name=""
                    id=""
                  >
                    <option value="">Interest</option>
                    {interest?.map((el, index) => (
                      <option key={index}>{el}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-[70%] p-3 h-[38%] bg-white grid grid-cols-2 ">
                {searchData.interest.map((el, index) => (
                  <div
                    key={index}
                    className="sm:w-32 sm:text-base w-18 text-sm h-8 inline-flex justify-center items-center rounded-full boreder border"
                  >
                    <p>{el}</p>
                    <img
                      src="/minus-button.png"
                      onClick={() => removeInterest(index)}
                      className="ml-2 cursor-pointer"
                      width={15}
                      height={15}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-[15%] flex justify-center items-center ">
              <button
                onClick={() => handleSearch()}
                className="outline-none border-2 border-white text-white h-12 font-bold rounded-lg w-44"
              >
                SEARCH
              </button>
            </div>
          </div>
        </div>
      )}
{/* ////////////////////////////show partener profile///////////////////////////// */}

      {showProfile && (
        <div className=" w-[100%] flex  justify-center items-center h-[650px]  fixed z-[2]">
          <div className="sm:w-[27%] w-[70%] sm:h-[80%] h-[80%] flex  items-center flex-col bg-white rounded-3xl">
            <div className="w-[100%] rounded-t-lg h-[35%] bg-theme-blue  ">
              <div className="w-full h-[20%]  ">
                <div className="bg-red-400 w-8  h-8 ml-2 mt-2  rounded-full text-xs ">
                  <img
                  onClick={()=>setShowProfile(false)}
                    src="left-arrow_6507331.png"
                    className=" h-full w-full cursor-pointer"
                    alt=""
                  />
                </div>
              </div>
              <div className="w-full h-[100%] flex flex-col bg-theme-blue items-center  ">
                <div className="sm:w-36 sm:h-36 h-24 w-24  rounded-full">
                  <img
                    src={(!partnerProfile.photo||partnerProfile.photo==='')?'./defualtImage.jpg':partnerProfile.photo}
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <p className="font-popin sm:text-xl mt-2 font-semibold text-slate-200">
                 {partnerProfile.name+' '+partnerProfile.secondName}
                </p>
              </div>
              
              <div className="w-[100%]  font-popin h-[70%]  grid gap-2 grid-cols-2  ">
                <div className="w-[100%] flex justify-center items-center flex-col h-[100%] ">
                  <p className="font-bold">{partnerProfile.age}</p>
                  <p className="text-gray-400">Age</p>
                </div>
                <div className="w-[100%] h-[100%] flex justify-center items-center flex-col ">
                  <p className="font-bold">{partnerProfile.gender}</p>
                  <p className="text-gray-400">Gender</p>
                </div>
                <div className="w-[100%] h-[100%]  flex justify-center items-center flex-col">
                  <p className="font-bold">{partnerProfile.state}</p>
                  <p className="text-gray-400">District</p>
                </div>

                <div className="w-[100%] flex justify-center items-center flex-col h-[100%] ">
                  <p className="font-bold">{new Date(partnerProfile.dateOfBirth).toLocaleDateString()}</p>
                  <p className="text-gray-400">Date of birth</p>
                </div>
              </div>
              <div className="w-full h-[91%] rounded-b-3xl  ">
                <p className="px-6 py-2 text-gray-400">Interest</p>
                {(partnerProfile.interest.length)?
                <div className="w-[90%] ml-5 mt-2 p-2 h-[60%]   grid grid-cols-3 gap-2">
                  {partnerProfile?.interest.map((el,index)=>{
                    return(
                      <div key={index}  className="w-[100%] h-8 bg-green-400 rounded-full text-gray-100 font-semibold flex justify-center items-center sm:text-base text-xs ">{el}</div>
                    )
                  })}
                 
                </div>:
                <div className="w-[90%] ml-5 mt-2 p-2 h-[60%]   flex justify-center items-center">
                  <p className="font-bold">INTEREST NOT AVAILABLE</p>
                </div>
                }
                
              </div>
              <div className=" w-8 h-8  rounded-full relative bottom-6  cursor-pointer left-[47%]">
                <img onClick={()=>(handleMatch(partnerProfile._id),setShowProfile(false),setParternProfile({
    _id: "",
    age: 0,
    gender: "",
    interest: [],
    lookingFor: "",
    name: "",
    no: 0,
    photo: "./defualtImage.jpg",
    secondName: "",
    state: "",
    dateOfBirth: "",
  }))} src="./profilAdd.png" className="w-full h-full" alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
      <Navbar
        active={active}
        openSearchModalFunc={openSearchModalFunc}
        resetProfilePage={resetProfilePage}
      />
      <div className="w-[100%] h-full mt-2   flex">
        <div className="sm:w-[20%] w-[40%]  h-[600px] mt-20">
          <div className="w-full h-[30%]  flex justify-center items-center">
            {/* ///////////////////subscription card/////////////// */}
            {planData?.name ? (
              <div className="w-[95%] sm:h-[85%] h-[70%]  bg-dark-blue  rounded-3xl ">
                <div className="w-fullh-[30%]   flex justify-center items-center">
                  {" "}
                  <p className="font-aborato font-black sm:text-2xl pt-1 text-base text-gray-200 ">
                    {planData.name}
                  </p>
                </div>
                <div className="w-full h-[40%] flex items-center pl-3   "></div>
                <div className="w-[80%] sm:w-full  sm:ml-0 ml-4 h-[30%] sm:text-base  flex justify-center items-center">
                  <div className="w-44 sm:h-9 h-6 bg-slate-300 flex sm:text-base text-xs justify-center items-center">
                    <p>
                      connection left :{planData.avialbleConnect}/
                      {planData.connect}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[95%] h-[85%] bg-dark-blue flex justify-center items-center  rounded-3xl ">
                <h1 className="font-bold sm:ml-0 ml-10 text-white sm:text-base text-sm">PLAN NOT AVAILABLE</h1>
              </div>
            )}
          </div>
          <div className="w-full h-[70%] rounded-full flex justify-center items-center ">
            <div className="w-[95%] h-[100%] bg-dark-blue rounded-3xl   ">
              <div className="w-full h-[20%] flex justify-center  ">
                {" "}
                <p className="font-mono font-black sm:text-2xl text-base text-gray-200 mt-2 ">
                  REQUEST
                </p>
              </div>
              <div id="request" className="w-full h-[80%]   bg-dark-blue ">
                {requestProfile?.map((el, index) => {
                  return (
                    <div
                      className="w-full sm:h-16 h-10 mt-3 bg-theme-blue flex"
                      key={index}
                    >
                      <div className="w-[70%]  sm:text-base text-xs h-full    flex items-center justify-around ">
                        <div className="sm:w-12 sm:h-12 w-8 h-8  bg-slate-500 rounded-full">
                          <img
                            src={el.photo ? el.photo : "/adminLogin_.png"}
                            className="w-full h-full rounded-full"
                            alt=""
                          />
                        </div>
                        <p className="font-popin  sm:px-6 sm:py-2 ">
                          {el.name}
                        </p>
                      </div>
                      <div className="w-[30%]  h-full flex justify-around items-center">
                        <div className="sm:w-5 w-4 h-4 sm:h-5 cursor-pointer ">
                          <img
                            onClick={() => acceptRequest(el._id)}
                            src="/checked.png"
                            className="w-full cursor-pointer h-full "
                            alt=""
                          />
                        </div>
                        <div className="sm:w-5 w-4 h-4 sm:h-5 cursor-pointer ">
                          <img
                            onClick={() => rejectRequest(el._id)}
                            src="/remove.png"
                            className="w-full h-full"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-[75%] w-[60%] h-full   ">
          {/* ///////card///////////////////////////////// */}

          <div className="sm:px-10 px-2 py-16    bg-center grid grid-cols-1 w-[100%]   mt-4 sm:ml-10 min-h-[600px]  md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-3 gap-14  ">
            {currentData?.map((el, index) => (
              <div
                onClick={(e) => handleShowProfile(e,el)}
                key={index}
                className="sm:w-[225px] sm:h-[250px] w-[200px] h-[250px] cursor-pointer m hover:shadow-3xl bg-[#007bff] p-1"
              >
                <div className="w-[100%] sm:h-[80%] h-[75%] border border-white bg-slate-500">
                  <img
                    className="w-full h-full"
                    src={
                      el?.photo === "" || !el.photo
                        ? "./defualtImage.jpg"
                        : el.photo
                    }
                    alt="x"
                  />
                  <div className="w-8 h-8 z-12  relative rounded-full  bottom-4 left-44 ">
                    <img
                      onClick={(e) => handleMatch(el._id, e)}
                      src="./add-button-2.png"
                      className="cursor-pointer h-full w-full"
                      alt=""
                    />
                  </div>
                </div>
                <p className=" bl-2 text-white font-popin font-semibold">
                  {el.name}
                </p>
                <p className=" text-sm text-white">
                  {el.age} years age {el.state}
                </p>
              </div>
            ))}
          </div>
          {/* ///////////////////////////////pagination//////////////////////////// */}
          <div className="w-[80%] h-14  flex justify-center items-center text-center">
            <p className="mt-4 mr-1 ">
              <span className="font-bold text-center">{currentPage}</span> of{" "}
              {totalPage}{" "}
            </p>
            <button
              onClick={() => handlePreviouse()}
              disabled={currentPage === 1}
              className="bg-dark-blue text-white rounded-full sm:h-14 h-9 w-9 sm:w-14"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handleNext()}
              disabled={currentPage === totalPage}
              className="bg-dark-blue text-white rounded-full sm:h-14 h-9 w-9 sm:w-14 ml-1 font-bold "
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};
