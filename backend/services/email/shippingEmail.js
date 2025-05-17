// const { sendEmail } = require("./sendgridClient");

// const shippingConfirmation = async (cartItems) => {
//   try {
//     const itemsHtml = cartItems
//       .map(
//         (item) => `
//       <div class="item">
//         <img src="http://localhost:3000/assets/images/${
//           item.imageUrls[0]
//         }" alt="${item.name}" class="item-image" />
//         <div class="item-details">
//           <h3 class="item-name">${item.name}</h3>
//           <p class="item-price">$${item.price.toFixed(2)}</p>
//         </div>
//       </div>
//     `
//       )
//       .join("");

//     await sendEmail(
//       " ",
//       "Order Confirmation",
//       "This is a plain text version of the email.",
//       `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
// <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
//     <head>
//       <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
//       <!--[if !mso]><!-->
//       <meta http-equiv="X-UA-Compatible" content="IE=Edge">
//       <!--<![endif]-->
//       <!--[if (gte mso 9)|(IE)]>
//       <xml>
//         <o:OfficeDocumentSettings>
//           <o:AllowPNG/>
//           <o:PixelsPerInch>96</o:PixelsPerInch>
//         </o:OfficeDocumentSettings>
//       </xml>
//       <![endif]-->
//       <!--[if (gte mso 9)|(IE)]>
//   <style type="text/css">
//     body {width: 600px;margin: 0 auto;}
//     table {border-collapse: collapse;}
//     table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
//     img {-ms-interpolation-mode: bicubic;}
//   </style>
// <![endif]-->
//       <style type="text/css">
//     body, p, div {
//       font-family: arial,helvetica,sans-serif;
//       font-size: 14px;
//     }
//     body {
//       color: #000000;
//     }
//     body a {
//       color: #1188E6;
//       text-decoration: none;
//     }
//     p { margin: 0; padding: 0; }
//     table.wrapper {
//       width:100% !important;
//       table-layout: fixed;
//       -webkit-font-smoothing: antialiased;
//       -webkit-text-size-adjust: 100%;
//       -moz-text-size-adjust: 100%;
//       -ms-text-size-adjust: 100%;
//     }
//     img.max-width {
//       max-width: 100% !important;
//     }
//     .column.of-2 {
//       width: 50%;
//     }
//     .column.of-3 {
//       width: 33.333%;
//     }
//     .column.of-4 {
//       width: 25%;
//     }
//     ul ul ul ul  {
//       list-style-type: disc !important;
//     }
//     ol ol {
//       list-style-type: lower-roman !important;
//     }
//     ol ol ol {
//       list-style-type: lower-latin !important;
//     }
//     ol ol ol ol {
//       list-style-type: decimal !important;
//     }
//     @media screen and (max-width:480px) {
//       .preheader .rightColumnContent,
//       .footer .rightColumnContent {
//         text-align: left !important;
//       }
//       .preheader .rightColumnContent div,
//       .preheader .rightColumnContent span,
//       .footer .rightColumnContent div,
//       .footer .rightColumnContent span {
//         text-align: left !important;
//       }
//       .preheader .rightColumnContent,
//       .preheader .leftColumnContent {
//         font-size: 80% !important;
//         padding: 5px 0;
//       }
//       table.wrapper-mobile {
//         width: 100% !important;
//         table-layout: fixed;
//       }
//       img.max-width {
//         height: auto !important;
//         max-width: 100% !important;
//       }
//       a.bulletproof-button {
//         display: block !important;
//         width: auto !important;
//         font-size: 80%;
//         padding-left: 0 !important;
//         padding-right: 0 !important;
//       }
//       .columns {
//         width: 100% !important;
//       }
//       .column {
//         display: block !important;
//         width: 100% !important;
//         padding-left: 0 !important;
//         padding-right: 0 !important;
//         margin-left: 0 !important;
//         margin-right: 0 !important;
//       }
//       .social-icon-column {
//         display: inline-block !important;
//       }
//     }
//   </style>
//       <!--user entered Head Start--><!--End Head user entered-->
//     </head>
//     <body>
//       <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
//         <div class="webkit">
//           <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
//             <tr>
//               <td valign="top" bgcolor="#FFFFFF" width="100%">
//                 <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
//                   <tr>
//                     <td width="100%">
//                       <table width="100%" cellpadding="0" cellspacing="0" border="0">
//                         <tr>
//                           <td>
//                             <!--[if mso]>
//     <center>
//     <table><tr><td width="600">
//   <![endif]-->
//                                     <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
//                                       <tr>
//                                         <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
//     <tr>
//       <td role="module-content">
//         <p>Order Placed</p>
//       </td>
//     </tr>
//   </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="4c95c7b0-c194-410e-beaa-c51a43bfd561">
//     <tbody>
//       <tr>
//         <td style="font-size:6px; line-height:10px; padding:30px 250px 30px 250px;" valign="top" align="center">
//           <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/d5b6368930021ae3/7fdfabb8-d07c-440f-b7e1-83fe286bd152/749x749.JPG">
//         </td>
//       </tr>
//     </tbody>
//   </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bf98361f-95af-4385-8f4f-9537e4c5c5c8" data-mc-module-version="2019-10-22">
//     <tbody>
//       <tr>
//         <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#eeeeee;" height="100%" valign="top" bgcolor="#eeeeee" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 24px; font-family: courier, monospace"><strong>Your order has been shipped!</strong></span></div><div></div></div></td>
//       </tr>
//     </tbody>
//   </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f30a8b31-8dfd-472c-ba5b-bd07d3437879" data-mc-module-version="2019-10-22">
//     <tbody>
//       <tr>
//         <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: courier, monospace">Dear [Customer Name],</span></div>
// <div style="font-family: inherit; text-align: inherit"><br></div>
// <div style="font-family: inherit; text-align: inherit"><span style="font-family: courier, monospace">Your order has been finished and shipped!</span></div>
// <div style="font-family: inherit; text-align: inherit; margin-left: 0px"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-alternates: inherit; font-variant-position: inherit; font-variant-emoji: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: courier, monospace; font-optical-sizing: inherit; font-size-adjust: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 0.875rem; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: rgb(117, 117, 117); border-right-color: rgb(117, 117, 117); border-bottom-color: rgb(117, 117, 117); border-left-color: rgb(117, 117, 117); border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; color: #000000; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 1px; -webkit-text-stroke-width: 0px; white-space-collapse: collapse; text-wrap-mode: wrap; background-color: rgba(0, 0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; caret-color: rgb(151, 153, 155); -webkit-tap-highlight-color: rgba(255, 255, 255, 0.25); text-size-adjust: auto; text-decoration-line: none">Tracking Number: [Tracking Number]</span></div>
// <div style="font-family: inherit; text-align: inherit; margin-left: 0px"><br></div>
// <div style="font-family: inherit; text-align: inherit"><span style="font-family: courier, monospace">Here is what you bought:</span></div><div></div></div></td>
//       </tr>
//     </tbody>
//   </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#FFFFFF" data-distribution="1,2">
//     <tbody>
//       <tr role="module-content">
//         <td height="100%" valign="top"><table width="193" style="width:193px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
//       <tbody>
//         <tr>
//           <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b3f998b4-a7d4-43cc-9f07-12a9817539a9">
//     <tbody>
//       <tr>
//         <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
//           <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="193" alt="" data-proportionally-constrained="true" data-responsive="true" src="">
//         </td>
//       </tr>
//     </tbody>
//   </table></td>
//         </tr>
//       </tbody>
//     </table><table width="386" style="width:386px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-1">
//       <tbody>
//         <tr>
//           <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="641567f7-db8f-4755-8bdb-2934d56fb154" data-mc-module-version="2019-10-22">
//     <tbody>
//       <tr>
//         <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-family: courier, monospace">[Item Name]</span></div><div></div></div></td>
//       </tr>
//     </tbody>
//   </table></td>
//         </tr>
//       </tbody>
//     </table></td>
//       </tr>
//     </tbody>
//   </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="70a010ad-2d05-46a7-ba8c-ee6d2e1d7e66" data-mc-module-version="2019-10-22">
//     <tbody>
//       <tr>
//         <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: start"><span style="caret-color: rgb(151, 153, 155); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; white-space-collapse: collapse; text-wrap-mode: wrap; word-spacing: 1px; -webkit-tap-highlight-color: rgba(255, 255, 255, 0.25); text-size-adjust: auto; -webkit-text-stroke-width: 0px; text-decoration-line: none; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 0.875rem; background-color: rgba(0, 0, 0, 0); border-top-color: rgb(117, 117, 117); border-right-color: rgb(117, 117, 117); border-bottom-color: rgb(117, 117, 117); border-left-color: rgb(117, 117, 117); color: #000000; font-family: courier, monospace">Thank you for choosing CYO Rugs!</span></div><div></div></div></td>
//       </tr>
//     </tbody>
//   </table><table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="dbf29c13-a82a-4d4f-bb05-e325f6c72c67">
//     <tbody>
//       <tr>
//         <td valign="top" style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px;" align="center">
//           <table align="center" style="-webkit-margin-start:auto;-webkit-margin-end:auto;">
//             <tbody><tr align="center"><td style="padding: 0px 5px;" class="social-icon-column">
//       <a role="social-icon-link" href="https://www.instagram.com/cyorugs/" target="_blank" alt="Instagram" title="Instagram" style="display:inline-block; background-color:#C13584; height:21px; width:21px;">
//         <img role="social-icon" alt="Instagram" title="Instagram" src="https://mc.sendgrid.com/assets/social/white/instagram.png" style="height:21px; width:21px;" height="21" width="21">
//       </a>
//     </td></tr></tbody>
//           </table>
//         </td>
//       </tr>
//     </tbody>
//   </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5"><div class="Unsubscribe--addressLine"></div><p style="font-size:12px; line-height:20px;"><a target="_blank" class="Unsubscribe--unsubscribeLink zzzzzzz" href="{{{unsubscribe}}}" style="">Unsubscribe</a> - <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="">Unsubscribe Preferences</a></p></div></td>
//                                       </tr>
//                                     </table>
//                                     <!--[if mso]>
//                                   </td>
//                                 </tr>
//                               </table>
//                             </center>
//                             <![endif]-->
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </div>
//       </center>
//     </body>
//   </html>
//       `
//     );
//   } catch (error) {
//     console.error("Failed to send test email:", error);
//   }
// };

// // Example usage
// const cartItems = [
//   {
//     id: 1,
//     name: "Chrome Hearts + CDG",
//     price: 89.99,
//     imageUrls: ["/Users/sirbo/Downloads/cyo-rugs/src/assets/images/akira.png"],
//   },
//   {
//     id: 2,
//     name: "Elegant Persian Rug",
//     price: 299.99,
//     imageUrls: [
//       "/Users/sirbo/Downloads/cyo-rugs/src/assets/images/blondremoved.png",
//     ],
//   },
// ];

// shippingConfirmation(cartItems);
