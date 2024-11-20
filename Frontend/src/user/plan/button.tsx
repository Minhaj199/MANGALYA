// import React, { useEffect, useRef } from 'react'
// import {loadScript} from '@paypal/paypal-js'

//  const PaypalButton = () => {
//     const scriptLoaded=useRef
//     useEffect(()=>{

//         loadScript({clientId:'AUREtzT5do9sJyDg3X7zyW25VJdJ7O5Bgm1LOQiS4oYzMA6KS039gYXtkUOpZLenw7rg15nheE32Bpie'}).then((paypal)=>{
//             if(paypal?.Buttons){
//                 paypal.Buttons().render('#paypal').catch((error:any)=>{
//                     console.error('faild to render',error)
//                 })
//             }
//         }).then((error)=>{
//             console.error('faild to load the paypal js sdk script',error)
//         })
//     })
//     return <div id='paypal' className='w-[25%] [20%] flex justify-center items-center overflow-hidden'></div> 
// }
// export default React.memo(PaypalButton)