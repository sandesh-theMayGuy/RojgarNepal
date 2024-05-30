import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";


const router = express.Router();


router.get("/dashboard",authenticate,authorize(['Client']),(req,res)=>{
    res.send("Client Dashboard")
})

export default router;