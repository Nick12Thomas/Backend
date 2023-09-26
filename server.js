require("./config/db");
const app = require("express")();
const port = 3000;

const UserRouter = require("./api/user");

//post req from data base

const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/users", UserRouter);

app.listen(port, () => {
  console.log("Server started at 3000");
});


