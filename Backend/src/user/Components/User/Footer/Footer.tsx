

export const Footer = () => {
  
  return (
    <div className="w-screen h-72 bg-black flex">
      
        <div className="w-1/4 sm:w-1/3 h-full p-10">
          <img
            className=" sm:w-18 sm:h-16 cursor-pointer"
            src="./logo-no-background.png "
            alt=""
          />
        </div>
        <div className="w-1/3 h-full ">
          <div className="w-full h-1/5 text-white flex justify-center    items-end">
            <p className="mr-16">OFFICES</p>
          </div>
          <div className="w-full h-4/5">
            <ul className="grid gap-1 grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-row-2 p-5">
              <li className="text-white">KOLLAM</li>
              <li className="text-white">MALAPPURAM</li>
              <li className="text-white">KASARGODE</li>
              <li className="text-white">ERANAKULAM</li>
              <li className="text-white">EDIKI</li>
              <li className="text-white">KOTTAYAM</li>
            </ul>
          </div>
        </div>
        <div className="w-1/3 h-full bg-black">
          <div className="w-full h-1/5 text-white flex justify-center items-end">
            Contact us
          </div>
          <div className=" sm:w-full  h-3/5 sm:fh-full overflow-hidder   text-white sm:p-5 ">
            <p className="text-normal break-words">
              123 STREET,SAMPLE,MALAPPURAM KERALA INIDA SAMPLE@GMAIL .COM
            </p>
          </div>
        </div>
     
    </div>
  );
};
