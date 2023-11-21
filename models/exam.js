const mongoose = require('mongoose')

const ExamScheama = new mongoose.Schema({
    examType:{
        type:String,
        enum:['MCQ','OPEN_ENDED'],
        required:true, 
     },
     topic:{
        type:String,
        required:true,
     },
     examStarted:{
        type:Date,
     },
     examEnd:{
        type:Date,
     },
     noOfQuestions:{
        type:Number,
        required:true,
     },
     questions:{
        type:[mongoose.Schema.Types.ObjectId],
     },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
     }
},{
    timestamps:true
})

const Exam = mongoose.model('Exam',ExamScheama);

module.exports = Exam;