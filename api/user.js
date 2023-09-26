const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const bcrypt = require("bcrypt")

//signup
const namePattern = /^[A-Za-z\s]+$/;
router.post("/signup", (req, res) => {
  let {name, email, password} = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

console.log(name);
console.log(email);
console.log(password);
  if (name == "" || email == "" || password == "") {
    res.json({
      status: "failed",
      message: "please fill all the fields",
    });
  } else if (!namePattern.test(name)) {
    res.json({
      status: "Failed",
      message: "only letters are allowed in name ",
    });
  } else if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
    res.json({ status: "failed", message: "invalid Email" });
  } else if (password.length < 8) {
    res.json({ status: "failed", message: "Must be greater than 8 letters" });
  } else {
    // if user existed
    User.find({ email }).then((result) => {
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
              });
            });
          });
        }
      }).catch((err) => {
        console.log(err)
      res.json({ status: "failed", message: "An error occurred" });
    })
};
});

router.post("/signin", (req, res) => {
    let { email, password} = req.body;
 
  email = email.trim();
  password = password.trim();

// console.log(name);
// console.log(email);
// console.log(password);

if(email==""|| password==""){
    res.json({
        status:"Failed",
        message:"fill the data"
    })
}
else {
    User.find({email})
    .then(data=>{
        if(data){
            //user existed
            const hashPass =data[0].password
            bcrypt.compare(password,hashPass).then(result=>{
                //password match
                res.json({
                    status:"Success",
                    message:"Login Successful"
                })
            })
        }
            else{
                res.json({
                    status:"Failed",
                    message:"Invalid Credentials"
                })
               
            }
        
    })
}
});


module.exports = router