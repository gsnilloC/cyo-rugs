const { sendEmail } = require("./sendgridClient");

const confirmationEmail = async (email, name, trackingNumber) => {
  try {
    await sendEmail(
      email,
      "Order Confirmation",
      "This is a plain text version of the email.",
      `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <style type="text/css">
    body, p, div {
      font-family: "Courier New", Courier, monospace;
      font-size: 14px;
      color: #000000;
font-weight: 500;
      line-height: 1.5;
    }
    body a {
      color: #1188E6;
      text-decoration: none;
    }
    img.logo {
      max-width: 120px; /* Adjust the max-width */
      height: auto; /* Maintain aspect ratio */
    }
    @media screen and (max-width:480px) {
      img.logo {
        max-width: 100px; /* Smaller size for mobile */
      }
    }
  </style>
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
                                      <div style="font-family: inherit; text-align: center"><span style="font-family: Courier New, Courier, monospace; font-size: 20px">Your Rug has Shipped!</span></div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f30a8b31-8dfd-472c-ba5b-bd07d3437879">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
                                      <div style="font-family: inherit; text-align: inherit">
                                        <p>Dear ${name},</p>
                                        <p>Thank you for your order! We are pleased to confirm that your order has been successfully packaged and shipped.</p>
                                        <p>Here is your tracking number:</p>
                                        <p>${trackingNumber}</p>
                                        <p>Thank you for choosing CYO Rugs!</p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!-- Social Icons and Footer Here -->
                            </td>
                          </tr>
                        </table>
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
    console.error("Failed to send confirmation email:", error);
  }
};

module.exports = confirmationEmail;
