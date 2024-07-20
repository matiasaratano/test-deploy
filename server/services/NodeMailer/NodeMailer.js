import nodemailer from 'nodemailer';
import 'dotenv/config'; 

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER_NODEMAILER,
      pass: process.env.PASS_NODEMAILER,
    },
  });

  transporter.verify().then(() => {
    console.log("Ready for send emails");
  });