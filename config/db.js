const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Successfully connected ");
  })
  .catch((error) => {
    console.log(`can not connect to database, ${error}`);
  });
