const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {NAME_PATTERN , EMAIL_PATTERN } = require("../utils/utils");
const signup  = async (req,res,next)=>{
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    console.log(name,email,password);
    if (name == "" || email == "" || password == "") {
      res.status(301).json({
        status: "failed",
        message: "please fill all the fields",
      });
    } else if (!NAME_PATTERN.test(name)) {
      //name re jex
      res.status(301).json({
        status: "Failed",
        message: "only letters are allowed in name ",
      });
    } else if (!EMAIL_PATTERN.test(email)) {
      // mail re jex
      res.json({ status: "failed", message: "invalid Email" });
    } else if (password.length < 8) {
      res.json({ status: "failed", message: "Must be greater than 8 letters" });
    } else {
      User.find({ email })
        .then((result) => {
            console.log("res",result)
          if (result.length>0) {
            res.status(401).json({ status: "Failed", message: "User ALready Exist" });
          } else {
            const saltRound = 10;
            bcrypt.hash(password, saltRound).then((hashPass) => {
              const newUser = new User({
                name,
                email,
                password: hashPass,
              });
             
              newUser.save().then((result) => {   
                console.log(result);         
                const {password,...userData} = result._doc;
                const accessToken= jwt.sign(email,process.env.ACCESS_TOKEN);
                res.status(201).json({
                  status: "Success",
                  message: "Registered Successfully",
                  data:{
                    token:accessToken,
                    user:userData
                }
                });
               
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json({ status: "failed", message: "An error occurred" });
        });
    }
}

const signin = (req, res,next) => {
    let {email, password } = req.body;
    
    email = email.trim();
    password = password.trim();
  
    if (email == "" || password == "") {
      res.json({
        status: "Failed",
        message: "fill the data",
      });
    } else {
      User.find({ email }).then((user) => {
        if (user) {
          const accessToken= jwt.sign(email,process.env.ACCESS_TOKEN);
         
          //user existed
          const {password:hashPass,...userData} = user[0]._doc;
          bcrypt.compare(password, hashPass).then((result) => {
            //password match
            if(result){
              res.status(201).json({
                status: "Success",
                message: "Login Successful",
                data:{
                    token:accessToken,
                    user:userData
                }
              });
            }
            else{
              res.status(401).json({
                status: "Failed",
                message: "Invalid Credentials",
              });
            }
            
          });
        } 
      }).catch((e)=>{
        res.status(401).json({
            status: "Failed",
            message: "Invalid Credentials",
          });
      })
    }
  }

  module.exports ={signin,signup};