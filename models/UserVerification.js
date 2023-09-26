const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define the Users schema
const userVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date,  
});

// Create the Users model
const userVerification = mongoose.model("userVerification", userVerificationSchema);

module.exports = userVerification;
