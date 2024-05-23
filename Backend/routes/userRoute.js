
import express from "express";

const router = express.Router();
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

import AuthController from "../controllers/authController.js";

import emailTransporter from "../config/email.js";

import multer from "multer";
import path from "path";


import { dirname } from 'path';
import { fileURLToPath } from 'url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));


const authController = new AuthController();

let fullName,email,password,profileImage,phoneNo,location,userType;





// In-memory store for OTPs
const otpStore = new Map();






// Signup Route
router.post('/signup',  async (req, res) => {
     fullName = req.body.fullName;
     email = req.body.email;
     password = req.body.password;
    
     phoneNo = req.body.phoneNo;
     location = req.body.location;
     userType = req.body.userType;

  const validation = await authController.validateInput(fullName,email,password,phoneNo,location,userType);


  if (!validation.valid) {
     res.status(400).json({ error: validation.message });
  }



  //2. send OTP to email 


  const emailOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });


  const hashedEmailOtp = await bcrypt.hash(emailOtp, 10);


  otpStore.set(email, { emailOtp: hashedEmailOtp });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Your Email OTP Code',
    text: `Your OTP code is ${emailOtp}`
  };



  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
       res.status(500).json({ error: 'Failed to send email OTP' });
    }




    // res.status(200).json({status:success,message:"OTP sent to your email address"});

    res.status(200).json({status:"success",message:"OTP sent succesfully to your email address"});

  });








});





router.post('/verify-otp', async (req, res) => {
    const { emailOtp } = req.body;
  
    const storedOtps = otpStore.get(email);
    if (!storedOtps) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }
  
    const isEmailOtpValid = await bcrypt.compare(emailOtp, storedOtps.emailOtp);

  
    if (!isEmailOtpValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  
    otpStore.delete(email);



    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          fullName,
          email,
          password: hashedPassword,
          profileImage,
          phoneNo,
          location,
          userType
        });
  
        // Redirect based on user type

        res.status(200).json({ message: 'OTP verified and user created succesfully, redirecting to photo upload page', redirectUrl: 'user/profile-photo' });
       
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    
   
  });
  




  //Photo upload and handling logic



// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
 
    cb(null,path.join(__dirname,"../uploads/"));

      
    },
    filename: function (req, file, cb) {
      cb(null, email) // File name
    }
  })
  
  // Define custom file filter for image files
  const imageFilter = function (req, file, cb) {
    // Accept image files with jpg, jpeg, or png extensions
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
  
  // Initialize Multer with the storage and file filter configuration
  const upload = multer({ 
    storage: storage,
    fileFilter: imageFilter
  });



  router.post('/upload', upload.single('image'), (req, res) => {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
  
    if (userType == 'Freelancer') {
  
        res.status(200).json({ message: 'Image uploaded succesfully, redirecting to Services page', redirectUrl: 'user/service-details' });
      } else if (userType == 'Client') {
        res.status(200).json({ message: 'Image uploaded succesfully, redirecting to Client page', redirectUrl: '/client-dashboard' });
      }

  });

  




// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.uid }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
