const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define the Users schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the Users model
const User = mongoose.model("User", userSchema);

module.exports = User;
