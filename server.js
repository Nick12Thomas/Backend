require("dotenv").config();
var cors = require('cors')
const app = require("express")();
const port = process.env.PORT;
const UserRouter = require("./routes/user");
const ExamRouter  = require("./routes/exam");
const QuestionRouter  = require("./routes/questions");

require("./config/db");
//post req from data base
app.use(cors());
const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/api/user", UserRouter);
app.use("/api/exam",ExamRouter);
app.use("/api/question",QuestionRouter)

app.listen(port, () => {
  console.log("Server started");
});


