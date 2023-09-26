const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserOTPschema=new Schema({
    userID:String,
    otp:String,
    created:Date,
    expiresAt:Date,
})

const UserOTP=mongoose.model(
    "UserOTP",
    UserOTPschema
)

module.exports=UserOTP