
export const Search = () => {
    const religions: string[] = [
        "African Traditional & Diasporic",
        "Agnostic",
        "Atheist",
        "Baha'i",
        "Buddhism",
        "Cao Dai",
        "Chinese traditional religion",
        "Christianity",
        "Hinduism",
        "Islam",
        "Jainism",
        "Juche",
        "Judaism",
        "Neo-Paganism",
        "Non-religious",
        "Rastafarianism",
        "Secular",
        "Shinto",
        "Sikhism",
        "Spiritism",
        "Tenrikyo",
        "Unitarian-Universalism",
        "Zoroastrianism",
        "Primal-indigenous",
        "Other",
      ];
      const age: number[] = [];
      for (let i = 18; i <= 60; i++) {
        age.push(i);
      }
  return (
    <>
    <div className="w-screen h-1/6 bg-white flex justify-center items-center">
          <p className="text-3xl text-dark_red fin font-aborato">
            FIND YOUR PARTNER
          </p>
        </div>
        <div id="search-session" className="h-5/6 bg-red-800  bg-center">
          <div
            id="search-box"
            className="w-1/2 sm:w-1/3 h-full flex bg-gray-600 items-center flex-col"
          >
            <input
              type="text"
              className="mb-10 mt-16 bg-aash w-2/3 h-10 placeholder:text-white pl-8 outline-none text-white text-sm  sm:pl-16  sm:text-lg"
              placeholder="I AM LOOKING FOR "
            />
            <select
              name="Relgion"
              id=""
              className="mb-5  bg-aash w-2/3 h-10 placeholder:text-white pl-18  outline-none text-white text-xs  sm:text-lg sm:pl-12"
            >
              {religions.map((el) => {
                return (
                  <option key={el} value={el}>
                    {el}
                  </option>
                );
              })}
            </select>

            <select
              name="Religion"
              id=""
              className="mb-5 mt-5  bg-aash w-2/3 h-10 placeholder:text-white pl-18 outline-none text-white text-sm sm:text-lg md:pl-12"
            >
              {age.map((el) => {
                return (
                  <option key={el} value={el}>
                    {el}
                  </option>
                );
              })}
            </select>
            <label className="text-white mb-5" htmlFor="">
              TO
            </label>
            <select
              name="Relgion"
              className="  bg-aash w-2/3 h-10 placeholder:text-white pl-18 outline-none text-white text-sm sm:text-lg md:pl-12 mb-5"
            >
              {age.map((el) => {
                return (
                  <option key={el} value={el}>
                    {el}
                  </option>
                );
              })}
            </select>
            <button className="mt-12 w-2/3 h-10 bg-dark_red text-white">
              FIND MY PARTNER
            </button>
          </div>
        </div>
    </>
  )
}
