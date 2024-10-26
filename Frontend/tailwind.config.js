/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        inter:['Inter','sans-serif'],
        italian:['Italiana','sans-serif'],
        aborato:['Aboreto','sans-serif'],
        Lumanosimo:['Lumanosimo','sans-serif'],
        roboto:['Roboto','sans-serif'],
        popin:['Poppins','sans-serif']
      },
      colors:{
        'dark_red':'#990000',
        'light_red':'#DF5757',
        'red_FA0000':'#FA0000',
        'aash':'#BAA3A3',
        'input_dark':'#700303',
        'red_Active':'#E82A2A',
        'otp_red':'#3E1111',
        'admin_panel_Blue':'#2b5bee'
      }
    },
  },
  plugins: [
    function({addUtilities}){
      addUtilities({
        '.no-scrollbar':{
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none', 
          '-ms-overflow-style': 'none', 
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      })
    }
  ],
}
