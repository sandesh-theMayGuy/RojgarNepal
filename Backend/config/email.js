import nodemailer from "nodemailer";


const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "khatiwadasandesh01@gmail.com",
      pass: "yrrp vpbe dkeq shay"
    }
  });


  export default emailTransporter;