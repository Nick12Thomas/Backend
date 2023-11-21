const stringSimilarity = require("string-similarity");
const Quesion = require("../models/questions");

const checkQuestion = async (req,res,next) =>{
    const {questionId,userAnser} = req.body;
    try{
        let question = await Quesion.findById(questionId);
        if(!question){
            throw Error("No Question FOund");
        }
        if(question.questionType=='MCQ'){
            let isCorrect = question.answer.toLowerCase().trim() === userAnser.toLowerCase().trim();
            await Quesion.findByIdAndUpdate(questionId,{
                userAnswer:userAnser,
                isCorrect:isCorrect,
            })
            res.status(201).json({
                isCorrect
            })
        }else{
            let percentageSimilar = stringSimilarity.compareTwoStrings(
                question.answer.toLowerCase().trim(),
                userAnser.toLowerCase().trim()
            );
            await Quesion.findByIdAndUpdate(questionId,{
                userAnswer:userAnser,
                percentageCorrect:percentageSimilar,
            })
            res.status(201).json({
                percentageSimilar
            })

        }

    }catch(e){
        console.log(e)
        res.status(402).json({
            messege:"No Question found"
        })
    }
}

module.exports={
    checkQuestion
}