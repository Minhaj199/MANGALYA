// import { modalClasses } from "@mui/material"

// <div className="hidden w-[100%] sm:h-[80%] h-[75%] border border-white bg-slate-500">
//                   <img
//                     className="w-full h-full"
//                     src={
//                       el?.photo === "" || !el.photo
//                         ? "./defualtImage.jpg"
//                         : el.photo
//                     }
//                     alt="x"
//                   />
//                   <div className="w-8 h-8 z-12  relative rounded-full  bottom-4 left-44 ">
//                     <img
//                       onClick={(e) => handleMatch(el._id, e)}
//                       src="./add-button-2.png"
//                       className="cursor-pointer h-full w-full"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <p className=" hidden bl-2 text-white font-popin font-semibold">
//                   {el.name}
//                 </p>
//                 <p className=" hidden text-sm text-white">
//                   {el.age} years age {el.state}
//                 </p>






// partner showing modalClasses

// <div className="w-[100%] rounded-t-lg h-[35%] bg-theme-blue  ">
//               <div className="w-full h-[20%]  ">
//                 <div className=" w-8  h-8 ml-2 mt-2  rounded-full text-xs ">
//                   <img
//                     onClick={() => setShowProfile(false)}
//                     src="left-arrow_6507331.png"
//                     className=" h-full w-full cursor-pointer"
//                     alt=""
//                   />
//                 </div>
//               </div>
//               <div className="w-full h-[100%] flex flex-col bg-theme-blue items-center  ">
//                 <div className="sm:w-36 sm:h-36 h-24 w-24  rounded-full">
//                   <img
//                     src={
//                       !partnerProfile.photo || partnerProfile.photo === ""
//                         ? "./defualtImage.jpg"
//                         : partnerProfile.photo
//                     }
//                     className="w-full h-full rounded-full"
//                     alt=""
//                   />
//                 </div>
//                 <p className="font-popin sm:text-xl mt-2 font-semibold text-slate-200">
//                   {partnerProfile.name + " " + partnerProfile.secondName}
//                 </p>
//               </div>

//               <div className="w-[100%]  font-popin h-[70%]  grid gap-2 grid-cols-2  ">
//                 <div className="w-[100%] flex justify-center items-center flex-col h-[100%] ">
//                   <p className="font-bold">{partnerProfile.age}</p>
//                   <p className="text-gray-400">Age</p>
//                 </div>
//                 <div className="w-[100%] h-[100%] flex justify-center items-center flex-col ">
//                   <p className="font-bold">{partnerProfile.gender}</p>
//                   <p className="text-gray-400">Gender</p>
//                 </div>
//                 <div className="w-[100%] h-[100%]  flex justify-center items-center flex-col">
//                   <p className="font-bold">{partnerProfile.state}</p>
//                   <p className="text-gray-400">District</p>
//                 </div>

//                 <div className="w-[100%] flex justify-center items-center flex-col h-[100%] ">
//                   <p className="font-bold">
//                     {new Date(partnerProfile.dateOfBirth).toLocaleDateString()}
//                   </p>
//                   <p className="text-gray-400">Date of birth</p>
//                 </div>
//               </div>
//               <div className="w-full h-[91%] rounded-b-3xl  ">
//                 <p className="px-6 py-2 text-gray-400">Interest</p>
//                 {partnerProfile.interest.length ? (
//                   <div className="w-[90%] ml-5 mt-2 p-2 h-[60%]   grid grid-cols-3 gap-2">
//                     {partnerProfile?.interest.map((el, index) => {
//                       return (
//                         <div
//                           key={index}
//                           className="w-[100%] h-8 bg-green-400 rounded-full text-gray-100 font-semibold flex justify-center items-center sm:text-base text-xs "
//                         >
//                           {el}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="w-[90%] ml-5 mt-2 p-2 h-[60%]   flex justify-center items-center">
//                     <p className="font-bold">INTEREST NOT AVAILABLE</p>
//                   </div>
//                 )}
//               </div>
//               <div className=" w-8 h-8  rounded-full relative bottom-6  cursor-pointer left-[47%]">
//                 <img
//                   onClick={() => (
//                     handleMatch(partnerProfile._id),
//                     setShowProfile(false),
//                     setParternProfile({
//                       _id: "",
//                       age: 0,
//                       gender: "",
//                       interest: [],
//                       lookingFor: "",
//                       name: "",
//                       no: 0,
//                       photo: "./defualtImage.jpg",
//                       secondName: "",
//                       state: "",
//                       dateOfBirth: "",
//                     })
//                   )}
//                   src="./profilAdd.png"
//                   className="w-full h-full"
//                   alt=""
//                 />
//               </div>
//             </div>



