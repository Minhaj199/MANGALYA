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
        popin:['Poppins','sans-serif'],
        antiqua:['Inknut','sans-serif'],
        raleway:['Raleway','sans-serif'],
        acme:['Acme','sans-serif']
      },
      colors:{
        'dark_red':'#990000',
        'light_red':'#DF5757',
        'red_FA0000':'#FA0000',
        'aash':'#BAA3A3',
        'input_dark':'#700303',
        'red_Active':'#E82A2A',
        'otp_red':'#3E1111',
        'admin_panel_Blue':'#2b5bee',
        'dark-blue':'#0b3e80',
        'theme-blue':'#007bff'
      },
      boxShadow:{
        '3xl':'0 4px 12px 0 rgba(0, 0, 0, 0.8), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
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
