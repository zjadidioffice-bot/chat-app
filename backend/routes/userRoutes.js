const express=require("express");
const authMiddleware=require("../middleware/authMiddleware")
const{registerUser,loginUser,getUsers}=require("../controller/userController")

const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/",authMiddleware,getUsers)


module.exports=router;