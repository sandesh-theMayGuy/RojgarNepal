import express from "express";
import "dotenv/config";
import { Op, json } from 'sequelize';
import sequelize from "./models/config.js";


import User from "./models/userModel.js";
import Service from "./models/serviceModel.js";
import JobPosting from "./models/jobPostingModel.js";
import Review from "./models/reviewModel.js";
import Conversation from "./models/conversationModel.js";
import Message from "./models/messageModel.js";
import Booking from "./models/bookingModel.js";

import authenticate from "./middlewares/authenticate.js";
import authorize from "./middlewares/authorize.js";

import userRoute from "./routes/userRoute.js";
import clientRoute from "./routes/clientRoute.js";
import freelancerRoute from "./routes/freelancerRoute.js";

import cors from "cors";





const app = express();
const PORT = process.env.PORT;


// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());



// Synchronize all models
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database tables:', err);
  });




app.get("/",async (req,res)=>{
    res.send("Hello World");

})


app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This route is protected' });
});


app.use("/user",userRoute);


app.use("/client",clientRoute);
app.use("/freelancer",freelancerRoute);




async function createInstances() {
    try {
  
      // Create User instances
      const client = await User.create({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        profileImage: 'path/to/profileImage.jpg',
        phoneNo: '1234567890',
        location: 'Kathmandu, Nepal',
        userType: 'Client'
      });
  
      const freelancer = await User.create({
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        profileImage: 'path/to/profileImage.jpg',
        phoneNo: '0987654321',
        location: 'Pokhara, Nepal',
        userType: 'Freelancer'
      });
  
      console.log('Users created!');
  
      // Create Service instance
      const service = await Service.create({
        serviceName: 'Web Development',
        serviceType: 'IT',
        description: 'Full stack web development service.',
        rate: 50,
        isAvailable: true,
        uid: freelancer.uid // Link service to the freelancer
      });
  
      console.log('Service created!');
  
      // Create Booking instance
      const booking = await Booking.create({
        uid: client.uid,
        sid: service.sid,
        bookingDate: new Date(),
        isCompleted: false,
        bookingTime: '10:00:00'
      });
  
      console.log('Booking created!');
  
      // Create Review instance
      const review = await Review.create({
        uid: client.uid,
        bid: booking.bid,
        comment: 'Great service!',
        rating: 5,
        timestamp: new Date()
      });
  
      console.log('Review created!');
  
      // Create JobPosting instance
      const jobPosting = await JobPosting.create({
        uid: client.uid,
        description: 'Looking for a web developer for a new project.',
        location: 'Lalitpur, Nepal',
        date: new Date(),
        time: '14:00:00',
        serviceType: 'IT'
      });
  
      console.log('JobPosting created!');
  
      // Create Conversation instance
      const conversation = await Conversation.create({
        user1id: client.uid,
        user2id: freelancer.uid
      });
  
      console.log('Conversation created!');
  
      // Create Message instance
      const message = await Message.create({
        cvid: conversation.cvid,
        senderId: client.uid,
        timestamp: new Date(),
        content:"Hello There"
      });
  
      console.log('Message created!');
  
    } catch (error) {
      console.error('Error creating instances:', error);
    } 
  }


  createInstances();











app.listen(PORT,(async err=>{

    if(err){
    console.log(`Could not start server : ${err}`);
    }else{
        console.log(`Listening to port ${PORT}`)

        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
}))

