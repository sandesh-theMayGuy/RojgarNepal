import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import ClientController from "../controllers/clientController.js";

const router = express.Router();
const clientController = new ClientController();


router.get("/dashboard",authenticate,authorize(['Client']),(req,res)=>{
    res.send("Client Dashboard")
})

router.post("/post-job",authenticate,authorize(['Client']),async (req,res)=>{
    // const {uid,description,date,time,serviceType,location,latitude,longitude}= req.body;

    const response = await clientController.postJob(req.body);

    if(!response.success){
     return res.status(response.httpStatus).json({
            success:response.success,
            message:response.message
        })
    }else{
        return res.status(response.httpStatus).json({
            success:response.success,
            message:response.message,
            postData:response.data
        })
    }

    
})


router.get("/recent-jobs",authenticate,authorize(['Client']),async (req,res)=>{

    const response = await clientController.getTredingJobPostings();

    if(!response.success){
            return res.status(response.httpStatus).json({
                success:response.success,
                message:response.message
            });
    }

    return res.status(response.httpStatus).json({
        success:response.success,
        message:response.message,
        recentJobs:response.data
    })
    
})



export default router;