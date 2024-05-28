import UserController from "./userController.js";
import { userType , email } from "../routes/userRoute.js";

const userController = new UserController();


class MediaController  {
    uploadImage = async(req,res)=>{
         // Check if file is uploaded
         if (!req.file) {
            return res.status(400).json({success:false,message:"No file uploaded"});
          }
      
          const imageName = `${userType}-${email}`;
          const DBStatus = await userController.insertImageName(email,imageName,userType);
          
      
          if(!DBStatus.success){
            return res.status(400).json({success:false,message:"Could not upload image"});
          }
      
          if (userType == 'Freelancer') {


              return res.status(200).json({ success:true,message: 'Image uploaded succesfully, redirecting to Services page', redirectUrl: 'user/service-details' });
            } else if (userType == 'Client') {
             return res.status(200).json({ success:true,message: 'Image uploaded succesfully, redirecting to Client page', redirectUrl: '/client-dashboard' });
            }
        
            }
}



export default MediaController;