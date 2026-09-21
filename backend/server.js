require("dotenv").config();
const express=require("express")
const cors=require("cors")
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes")
const messageRoutes=require("./routes/messageRoutes")
const app=express();
connectDB()
app.use(cors());
app.use(express.json())
app.use("/api/users",userRoutes)
app.use("/api/messages",messageRoutes);
app.get("/",(req,res)=>
{
    res.json({message:"chat api is running"});
});

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});