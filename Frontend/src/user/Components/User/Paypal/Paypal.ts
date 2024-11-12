
// import React, { useEffect } from "react";
// import axios from 'axios';

// interface PayPalButtonProps {
//   planId: string;
//   amount: number;
//   onSuccess: () => void;
// }


// const loadPayPalScript = () => {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD";
//     script.onload = () => resolve(window.paypal);
//     script.onerror = reject;
//     document.body.appendChild(script);
//   });
// };

// const PlanPurchase = () => {
//   useEffect(() => {
//     loadPayPalScript().then((paypal) => {
//       // Now you can access window.paypal safely
//       paypal.Buttons({
//         // Define your PayPal button options here
//       }).render("#paypal-button-container");
//     }).catch((error) => {
//       console.error("Failed to load PayPal script:", error);
//     });
//   }, []);

//   return <div id="paypal-button-container"></div>;
// };

// export default PlanPurchase;

// export default PayPalButton;
