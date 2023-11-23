const mongoose = require("mongoose");

const chatsSchema = new mongoose.Schema(
  {
    pdfName: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    userId: { type:mongoose.Schema.Types.ObjectId,ref:'User' },
    fileKey: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatsSchema);

module.exports = Chat;
