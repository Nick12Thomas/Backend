const Message = require("../models/messeges");

const getMessges = async (req,res,next) =>{
    const {chatId} = req.params;
    try{
        const messages = await Message.find({chatId:chatId}).sort({"createdAt": 1});
        res.status(201).json({
            messages:messages
        })

    }catch(e){
        res.json(501).json({
            messages:"Unable to get messages"
        })
    }
}

module.exports = {getMessges};