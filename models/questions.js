const mongoose = require("mongoose");

// Define the Users schema
const QuestionSchema = new mongoose.Schema({
    questionType:{
        type:String,
        enum:['MCQ','OPEN_ENDED'],
        required:true
    },
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true,
    },
    // Only for MCQ
    options:{
        type:Object,
    },
    // Only for Open Ended
    percentageCorrect:{
        type:mongoose.Types.Decimal128,
    },
    // Only for MCQ
    isCorrect:{
        type:Boolean,
    },
    examId:{
        type:mongoose.Types.ObjectId,
        ref:"Exam"
    },
});

// Create the Users model
const Quesion = mongoose.model("Question", QuestionSchema);

module.exports = Quesion;
