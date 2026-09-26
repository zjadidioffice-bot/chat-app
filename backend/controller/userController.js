const User=require("../models/User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const registerUser=async(req,res)=>{
    try {
        const{name,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword
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

const loginUser=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }
        const isPasswordCorrect=await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordCorrect)
        {
            return res.status(401).json({message:"invalid password"});
        }
                const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        user.password=undefined;
        res.json({
            message:"login successfully",
            token,
            user
        });        
    } catch (error) {
        res.status(500).json({
            message:"server error",
            error:error.message
        });
    }
};


const getUsers=async(req,res)=>{
    try {
        const users=await User.find().select("-password");
        res.json(users)
    } catch (error) {
        res.status(500).json({
            message:"error getting users",
            error:error.message
        });
    }
};


module.exports={
    registerUser,
    loginUser,
    getUsers
};