
import express from "express";

const router = express.Router();
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


import AuthController from "../controllers/authController.js";
import UserController from "../controllers/userController.js";
import FreelancerController from "../controllers/freelancerController.js";
import MediaController from "../controllers/mediaController.js";

const authController = new AuthController();
const userController = new UserController();
const freelancerController = new FreelancerController();
const mediaController = new MediaController();


import multer from "multer";
import path from "path";
import upload from "../config/media.js";


import { dirname } from 'path';
import { fileURLToPath } from 'url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));




let fullName,email,password,confirmPassword,profileImage,phoneNo,location,userType;




// Signup Route
router.post('/signup',  async (req, res) => {
     fullName = req.body.fullName;
     email = req.body.email;
     password = req.body.password;
     confirmPassword = req.body.confirmPassword;
     phoneNo = req.body.phoneNo;
     location = req.body.location;
     userType = req.body.userType;

  const validation = await authController.validateInput(fullName,email,password,confirmPassword,phoneNo,location,userType);

  if (!validation.valid) {
   return  res.status(400).json({ success:false,message: validation.message });
  }else{
    
    const status = await authController.sendMail(email);

    if(status.success){
     return res.status(200).json({success:true,message:"OTP sent succesfully to your email address"});
    }else{
      return res.status(400).json({sucess:true,message:"Could not send OTP to your email address"});
    }
  
  }


});



router.post('/verify-otp', async (req, res) => {
  
  
  const { emailOtp } = req.body;

  if (!emailOtp) {
    return res.status(400).json({ success: false, message: "Please type OTP sent to your email" });
  }

  try {
    const status = await authController.verifyOTP(emailOtp);

    if(!status.success){
      return res.status(400).json({success:false,message:status.message});
    }

    const userStatus = await userController.createUser(fullName, email, password, profileImage, phoneNo, location, userType);

    if (!userStatus.success) {
      return res.status(500).json({ success: false, message: userStatus.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'OTP verified and user created successfully'
    });
  } catch (error) {
    // In case of unexpected errors, send a generic error response
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  });
  



  //Media Route (to handle image uploads and management)
  router.post('/upload', upload.single('image'),mediaController.uploadImage);

  
  //Service Route 
  router.post('/service', freelancerController.createService);
  
// Login Route
router.post('/login',userController.logInUser);


export default router;

export {fullName,email,password,confirmPassword,profileImage,phoneNo,location,userType};