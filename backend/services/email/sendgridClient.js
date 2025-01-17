require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const fs = require("fs");

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not set in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  console.log(`Sending email to: ${to}, Subject: ${subject}`);
  const msg = {
    to,
    from: "orders@cyorugs.com", // Replace with your verified sender
    subject,
    text, // This is the plain text version
    html, // This is the HTML version
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
