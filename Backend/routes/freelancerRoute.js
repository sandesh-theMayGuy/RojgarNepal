import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();


router.get("/dashboard",authenticate,authorize(['Freelancer']),(req,res)=>{
    res.send("Freelancer Dashboard")
})

export default router;