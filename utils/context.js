const { Pinecone } = require("@pinecone-database/pinecone");
const { convertToAscii } = require("./utils");
const { getEmbeddings } = require("./embeddings");

async function getMatchesFromEmbeddings(
    embeddings,
    fileKey
  ) {
    try {
      const client = new Pinecone({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECOIN_API_KEY,
      });
      const pineconeIndex = await client.index("chatpdf");
      const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
      const queryResult = await namespace.query({
        topK: 5,
        vector: embeddings,
        includeMetadata: true,
      });
      return queryResult.matches || [];
    } catch (error) {
      console.log("error querying embeddings", error);
      throw error;
    }
  }
  
async function getContext(query, fileKey) {
    const queryEmbeddings = await getEmbeddings(query);
    console.log(queryEmbeddings);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  
    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > 0.7
    );
  
    
  
    let docs = qualifyingDocs.map((match) => (match.metadata).text);
    // 5 vectors
    return docs.join("\n").substring(0, 3000);
  }

  module.exports={getContext,getMatchesFromEmbeddings};