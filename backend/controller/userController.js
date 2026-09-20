const User=require("../models/User")

const registerUser=async(req,res)=>{
    try {
        const{name,email,password}=req.body;
        const user=await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message:"user registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message:"error registering user",
            error:error.message
        });
    }
};
module.exports={
    registerUser,
};