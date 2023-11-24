require("dotenv").config();
var cors = require('cors')
const app = require("express")();
const port = process.env.PORT;
const UserRouter = require("./routes/user");
const ExamRouter  = require("./routes/exam");
const QuestionRouter  = require("./routes/questions");
const ChatRouter = require("./routes/chat")
const MessgeRouter = require("./routes/messges");
const bodyParser = require("body-parser");

require("./config/db");
//post req from data base
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/user", UserRouter);
app.use("/api/exam",ExamRouter);
app.use("/api/question",QuestionRouter)
app.use("/api/chat",ChatRouter);
app.use("/api/messeges",MessgeRouter);


app.listen(port, () => {
  console.log("Server started");
});

