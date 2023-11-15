require("dotenv").config();
var cors = require('cors')
const app = require("express")();
const port = process.env.PORT;
const UserRouter = require("./routes/user");
require("./config/db");
//post req from data base
app.use(cors());
const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log("Server started");
});


