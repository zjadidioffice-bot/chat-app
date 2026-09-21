const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reciver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },{
        timestamps:true
    }
);

module.exports=moongose.model("Message",messageSchema)