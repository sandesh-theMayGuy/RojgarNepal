import User from "../models/userModel.js";

class authController{

     validateInput = async  (fullName, email, password, phoneNo, location, userType) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const passwordRegex = /^(?=.*\d)[A-Za-z\d]{5,}$/;

        if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };
        if (!phoneRegex.test(phoneNo)) return { valid: false, message: 'Invalid phone number format' };
        if (!passwordRegex.test(password)) return { valid: false, message: 'Password must exactly 5 characters long with at least one number' };

        // if (!passwordRegex.test(password)) return { valid: false, message: 'Password must be at least 5 characters long and contain at least one number' };
        if(location=="")return { valid: false, message: 'Location cant be empty'};
        if(fullName=="") return {valid:false,message:"Name can't be empty"};
        if(userType=="") return{valid:false,message:"User type can't be empty"};

        const userCount = await User.count({ where: { email } });

        if(userCount!=0) return{valid:false,message:"User with provided email already exists"};

        return { valid: true };
      };
}


export default authController;