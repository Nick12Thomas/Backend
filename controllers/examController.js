const Exam = require("../models/exam");
const Quesion = require("../models/questions");
const { generateQuestions, SYSTEM_PROMPT } = require("../utils/openAI");

const creatExam = async (req, res, next) => {
  const { prompt, topic, noOfQuestions, type, userId } = req.body;
  console.log(noOfQuestions);
  console.log(userId);
  try {
    // Save Exam
    const newExam = new Exam({
      examType: type,
      examStarted: Date.now(),
      userId: userId,
      topic:topic,
    });
    const exam = await newExam.save();
    // generate questions using AI - OpenAI
    if (type == "OPEN_ENDED") {
      const questions = await generateQuestions(
        SYSTEM_PROMPT,
        new Array(Number(noOfQuestions)).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
      // console.log(questions);
      const manyData = questions.map((question) => {
        // mix up the options lol
        return {
          question: question.question,
          answer: question.answer,
          examId: exam._id,
          questionType: "OPEN_ENDED",
        };
      });
      console.log(manyData);
      await Quesion.insertMany(manyData);
    } else if (type == "MCQ") {
        console.log(type);
        const questions = await generateQuestions(
            SYSTEM_PROMPT,
            new Array(Number(noOfQuestions)).fill(
              `You are to generate a random hard open-ended questions about ${topic}`
            ),
            {
              question: "question",
              answer: "answer with max length of 15 words",
              option1: "option1 with max length of 15 words",
              option2: "option2 with max length of 15 words",
              option3: "option3 with max length of 15 words",
            }
        );
        console.log(questions);
        const manyData = questions.map((question) => {
          // mix up the options lol
          const options = [
            question.option1,
            question.option2,
            question.option3,
            question.answer,
          ].sort(() => Math.random() - 0.5);
          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            examId: exam._id,
            questionType: "MCQ",
          };
        });
        await Quesion.insertMany(manyData);
    }


    // save question

    // Sent exam data
    res.status(201).json({
      messgae: "Created Successfull",
      exam:exam._id
    });
  } catch (e) {
    console.log(e)
    res.status(502).json({
      messgae: "Unbale to Create Exam. Try again Later",
      error:e
    });
  }
};
const getOpenEnded = async (req, res, next) => {
  const {userId} = req.body;
  const {examId:providedExamId} = req.params;
  console.log(providedExamId);
  try{
    const exam = await Exam.findById(providedExamId);
    if(exam.userId.toString() !== userId.toString()){
      throw new Errow('You have not access to to exam');
    }
    if(exam.examType!=='OPEN_ENDED'){
      throw new Error('Not A Valid Exam');
    }
    const questions = await Quesion.find({examId:providedExamId}).select('_id question answer')
    if(questions.length==0){
      throw new Error("Unable to get questions");
    }
    const examDetails ={
      ...exam._doc,
      questions:[
        ...questions
      ]
    }
    res.status(201).json({
      messgae:"Found",
      exam:examDetails
    })
  }catch(e){
    console.log(e)
    res.status(502).json({
      messgae:e.messgae
    })
  }
};

const getMCQ = async (req, res, next) => {
  const {userId} = req.body;
  const {examId:providedExamId} = req.params;
  console.log(providedExamId);
  try{
    const exam = await Exam.findById(providedExamId);
    if(exam.userId.toString() !== userId.toString()){
      throw new Errow('You have not access to to exam');
    }
    if(exam.examType!=='MCQ'){
      throw new Error('Not A Valid Exam');
    }
    const questions = await Quesion.find({examId:providedExamId}).select('_id question options')
    if(questions.length==0){
      throw new Error("Unable to get questions");
    }
    const examDetails ={
      ...exam._doc,
      questions:[
        ...questions
      ]
    }
    res.status(201).json({
      messgae:"Found",
      exam:examDetails
    })
  }catch(e){
    console.log(e)
    res.status(502).json({
      messgae:e.messgae
    })
  }
};

const endExam = async (req,res,next) => {
  const {examId,earnedMarks} = req.body;
  try{
    const exam = await Exam.findById(examId);
    if(!exam){
      throw new Error("Not Found the exam");
    }
    await Exam.findByIdAndUpdate(examId,{
      examEnd:new Date(),
      earnedMarks:earnedMarks
    })
    res.status(201).json({
      messgae:"Exam has been ended"
    })
  }catch(e){
    
  }
}

module.exports = {
  getOpenEnded,
  creatExam,
  getMCQ,
  endExam
};
