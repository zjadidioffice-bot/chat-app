const Message = require("../models/Message");

const sendMessage = async (req, res) => {
    try {
        const { reciver, message } = req.body;
        const newMessage = await Message.create({
            sender: req.userId,
            reciver,
            message
        });

        res.status(201).json({
            message: "message sent successfully",
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({
            message: "error sending message"
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
            $or: [
                {
                    sender: req.userId,
                    reciver: userId
                }
                ,
                {
                    sender: userId,
                    reciver: req.userId
                }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: "error geting message",
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    
}