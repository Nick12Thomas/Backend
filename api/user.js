const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
//env variables
require("dotenv").config();
// user model
const User = require("./../models/user");
// password handler
const bcrypt = require("bcrypt");
// mongodb user verification model
const UserVerification = require("./../models/UserVerification");

//email handler
const nodeMailer= require("nodemailer");

//otp
const UserOTP=require("./../models/userOTP")





//signup
const namePattern = /^[A-Za-z\s]+$/; // name validator

//nodemailer

router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;

  // removing white spaces
  name = name.trim();
  email = email.trim();
  password = password.trim();

  // console.log(name);
  // console.log(email);
  // console.log(password);

  //is any of these data is missing
  if (name == "" || email == "" || password == "") {
    res.json({
      status: "failed",
      message: "please fill all the fields",
    });
  } else if (!namePattern.test(name)) {
    //name re jex
    res.json({
      status: "Failed",
      message: "only letters are allowed in name ",
    });
  } else if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
    // mail re jex
    res.json({ status: "failed", message: "invalid Email" });
  } else if (password.length < 8) {
    res.json({ status: "failed", message: "Must be greater than 8 letters" });
  } else {
    // if user existed
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({ status: "Failed", message: "User ALready Exist" });
        } else {
          //password handler
          const saltRound = 10;
          bcrypt.hash(password, saltRound).then((hashPass) => {
            const newUser = new User({
              name,
              email,
              password: hashPass,
            });
           
            newUser.save().then((result) => {            
             
              res.json({
                status: "Success",
                message: "Registered Successfully",
                data: result,
                accessToken:accessToken,
              });
             
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: "failed", message: "An error occurred" });
      });
  }
});


router.post("/signin", (req, res) => {
  let { name,email, password } = req.body;
  // removing white spaces
  
  email = email.trim();
  password = password.trim();

  // console.log(name);
  // console.log(email);
  // console.log(password);

  if (email == "" || password == "") {
    res.json({
      status: "Failed",
      message: "fill the data",
    });
  } else {
    User.find({ email }).then((data) => {
      if (data) {
        const accessToken= jwt.sign(email,process.env.ACCESS_TOKEN);
       
        //user existed
        const hashPass = data[0].password;
        bcrypt.compare(password, hashPass).then((result) => {
          //password match
          if(result){
            res.json({
              status: "Success",
              message: "Login Successful",
              accessToken:accessToken,
            });
          }
          else{
            res.json({
              status: "Failed",
              message: "Invalid Credentials",
            });
          }
          
        });
      } 
    });
  }
});

module.exports = router;
