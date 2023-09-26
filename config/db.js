const mongoose =require("mongoose")
const dotenv = require("dotenv");
dotenv.config();
const DB='mongodb+srv://Smart:Smart@smart.kgnkjxo.mongodb.net/userDB?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    
  })
  .then(() => {
    console.log("Successfully connected ");
  })
  .catch((error) => {
    console.log(`can not connect to database, ${error}`);
  });

