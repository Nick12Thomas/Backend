const mongoose = require("mongoose");
const messagesSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    content: { type: String, required: true },
    role: { type: String, enum: ['user', 'system'], required: true }, // Assuming userSystemEnum translates to these values
  },{
    timestamps:true
  });
const Message = mongoose.model('Message',messagesSchema);
module.exports = Message;