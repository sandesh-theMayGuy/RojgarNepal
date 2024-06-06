import JobPosting from "../models/jobPostingModel.js";

class ClientController{

    postJob = async(data)=>{
                const {userId,jobTitle,description,date,time,serviceType,location,latitude,longitude,proposedPayAmount}= data;
                const uid = userId;



                if(!uid || !jobTitle || !description || !date || !time || !serviceType || !location || !proposedPayAmount){
                   return{
                    success:false,
                    httpStatus:400,
                    message:"Please Fill All the Fields"
                   }
                }


                try{


                const DBresponse = await JobPosting.create({uid,jobTitle,description,date,time,serviceType,location,latitude,longitude,proposedPayAmount});

                return{
                    success:true,
                    httpStatus:200,
                    message:"Job Posted Succesfully",
                    data : DBresponse
                }


                }catch(err){
                    console.log(err);
                    return {
                        success:false,
                        httpStatus:500,
                        message:"Internal Server Error"
                    }
                }

                
    }


    getTredingJobPostings = async()=>{

        try{
        const posts = await JobPosting.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10
          });

          return{
            success:true,
            httpStatus:200,
            message:"Succesfull",
            data:posts
          }


        }catch(err){
            console.log(err);

            return{
                success:false,
                httpStatus:500,
                message:"Internal Server Error"
            }
        }


    }
}


export default ClientController;

