import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";


class FreelancerController {

createService = async (req,res)=>{

    const { userId, serviceName, serviceType, description, rate } = req.body;
  
    // Validate input
    if (!userId || !serviceName || !serviceType || !description || !rate ) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    try {
        // Check if the user exists and is a Freelancer
        const user = await User.findOne({
          where: {
            uid: userId,
            userType: 'Freelancer'
          }
        });

        if (!user) {
          return res.status(400).json({ success: false, message: "User not found or is not a Freelancer" });
        }

        // Create a new service
        const newService = await Service.create({
          serviceName,
          serviceType,
          description,
          rate,
          isAvailable: true, // Assuming services are available by default
          uid: userId
        });

        // Respond with the created service
        return res.status(200).json({ success: true, message:"Service added succesfully" });
      } catch (error) {
        console.error("Error creating service:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
        }
}



export default FreelancerController;


