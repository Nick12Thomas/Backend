const { uploadToS3, getS3Url } = require("../utils/s3");
const { OpenAIApi, Configuration } = require("openai");
const { loadS3IntoPinecone } = require("../utils/pinecone");
const { getContext } = require("../utils/context");

const Chat = require("../models/chats");
const Messege = require("../models/messeges");

const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { file_key, file_name } = await uploadToS3(req.file);
    if (!file_key || !file_name) {
      throw new Error("Unable to upload to File");
    }
    await loadS3IntoPinecone(file_key);
    const newChat = new Chat({
      pdfName: file_name,
      pdfUrl: getS3Url(file_key),
      userId: userId,
      fileKey: file_key,
    });
    const result = await newChat.save();
    res.status(201).json({
      message: "Done!",
      chat: result,
    });
  } catch (e) {
    console.log(e);
    res.status(502).json({
      message: "Internal Error",
    });
  }
};

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const chat = async (req, res, next) => {
  try {
    const { messages, chatId } = req.body;
    console.log(messages,chatId)
    const _chats = await Chat.findById(chatId);
    console.log(_chats)
    if (!_chats) {
      throw new Error("Hello");
    }
    const fileKey = _chats.fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            AI assistant is a big fan of Pinecone and Vercel.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message) => message.role === "user"),
      ],
    });
    
    console.log(response.data.choices[0].message);
    let result = response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";
    console.log(result);
    const useMessage = new Messege({
        chatId:_chats._id,
        role:"user",
        content:lastMessage.content
    })
    await useMessage.save();
    const systemMessege = new Messege({
        chatId:_chats._id,
        role:"system",
        content:result
    })
    await systemMessege.save();
    res.status(201).json({
        message:result
    })
  } catch (e) {
    console.log(e);
    res.status(502).json({
        message:"Nhi hua"
    })
  }
};

module.exports = {
  createChat,
  chat
};
