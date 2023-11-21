// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// async function generateQuestions(
//   system_prompt,
//   user_prompt,
//   output_format
// ){
//   try{
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//                       role: "system",
//                       content: system_prompt,
//                     },
//                     { role: "user", content: user_prompt.toString() + "Genrate 10 questions" },
//       ],
//       temperature: 0,
//       max_tokens: 1024,
//     });
//     console.log(response.choices[0].message)
//   }catch(e){
//     console.log(e);
//   }

// }


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const SYSTEM_PROMPT = "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array"
async function generateQuestions(
  system_prompt,
  user_prompt,
  output_format,
  default_category = "",
  output_value_only = false,
  model = "gpt-3.5-turbo",
  temperature = 1,
  num_tries = 1,
  verbose = false
) {
  // console.log(system_prompt,
  //   user_prompt,
  //   output_format,
  //   default_category,
  //   output_value_only,
  //   model,
  //   temperature,
  //   num_tries,
  //   verbose)
  const list_input = Array.isArray(user_prompt);
  const dynamic_elements = /<.*?>/.test(JSON.stringify(output_format));
  const list_output = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg = "";
  // console.log("Hello")
  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt = `\nYou are to output ${
      list_output && "an array of objects in"
    } the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
    }
    // console.log(list_input);
    console.log(output_format_prompt,user_prompt);
    let response;
    try {
      response = await openai.createChatCompletion({
        temperature: temperature,
        model: model,
        messages: [
          {
            role: "system",
            content: system_prompt + output_format_prompt + error_msg,
          },
          { role: "user", content: user_prompt.toString() },
        ],
      });
      console.log("No Error");
    } catch (error) {
      console.log("error");
      throw Error("Unable to Genrate Questions")
    }
    // console.log(response);
    
    let res = response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";
    console.log(res);
    res = res.replace(/(\w)"(\w)/g, "$1'$2");

    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }

    try {
      let output = JSON.parse(res);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of json");
        }
      } else {
        output = [output];
      }

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) {
            continue;
          }

          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key];
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }

            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }

            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format ", res);
      return JSON.parser(res);
    }
  }

  return [];
}

module.exports = {generateQuestions,SYSTEM_PROMPT};