const { sendEmail } = require("./sendgridClient");

const couponEmail = async (email, name, couponCode) => {
  try {
    await sendEmail(
      email,
      "Your CYO Rugs Coupon Code",
      "This is a plain text version of the email.",
      `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: "Courier New", Courier, monospace;
      font-size: 14px;
      color: #000000;
      font-weight: 500;
      line-height: 1.5;
    }
    body {
      color: #000000;
    }
    body a {
      color: #1188E6;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    ul ul ul ul  {
      list-style-type: disc !important;
    }
    ol ol {
      list-style-type: lower-roman !important;
    }
    ol ol ol {
      list-style-type: lower-latin !important;
    }
    ol ol ol ol {
      list-style-type: decimal !important;
    }
    img.logo {
      max-width: 120px;
      height: auto;
    }
    .paragraph {
      margin-bottom: 20px;
    }
    .coupon-code {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 2px;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .social-icon-column {
        display: inline-block !important;
      }
      img.logo {
        max-width: 100px;
      }
    }
  </style>
      <!--user entered Head Start--><!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:Courier New, Courier, monospace; color:#000000; background-color:#FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                      <tr>
                                        <td align="center" style="padding: 20px 0;">
                                          <img class="logo" src="https://cyo-rugs-requests.s3.us-west-1.amazonaws.com/orders/logo.JPG" alt="CYO Rugs Logo">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left">
                                          <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bf98361f-95af-4385-8f4f-9537e4c5c5c8">
                                            <tbody>
                                              <tr>
                                                <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#eeeeee;" height="100%" valign="top" bgcolor="#eeeeee" role="module-content">
                                                  <div style="font-family: inherit; text-align: center"><span style="font-family: Courier New, Courier, monospace; font-size: 20px">Your Coupon Code for Future Purchase!</span></div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f30a8b31-8dfd-472c-ba5b-bd07d3437879">
                                            <tbody>
                                              <tr>
                                                <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
                                                  <div style="font-family: inherit; text-align: inherit">
                                                    <p class="paragraph">Dear ${name},</p>
                                                    <p class="paragraph">Thank you for your recent purchase! We appreciate your business and would like to offer you a special discount on your next order.</p>
                                                    <p class="paragraph">Here is your exclusive coupon code:</p>
                                                    <p class="coupon-code">${couponCode}</p>
                                                    <p class="paragraph">This code can be used for 15% off your next purchase. We look forward to serving you again!</p>
                                                    <p class="paragraph">Thank you for choosing CYO Rugs!</p>
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>
      `
    );
  } catch (error) {
    console.error("Failed to send coupon email:", error);
    throw error;
  }
};

module.exports = couponEmail;
