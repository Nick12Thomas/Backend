const { Pinecone, utils:PineConeUtils } = require("@pinecone-database/pinecone");
const { downloadFromS3 } = require("./s3-server");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const {
  Document,
  RecursiveCharacterTextSplitter,
} = require("@pinecone-database/doc-splitter");

const md5 = require("md5");
const { getEmbeddings } = require("./embeddings");
const { convertToAscii } = require("./utils");
const getPineconeClient = async () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECOIN_API_KEY,
  });
  
};

const loadS3IntoPinecone = async (file_key) => {
  // 1. obtain the pdf
  const file_name = await downloadFromS3(file_key);
  if (!file_name) {
    throw new Error("Could not download from s3");
  }
  const loader = new PDFLoader(file_name);
  const pages = await loader.load();

  // 2. split and segment teh pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorize and embed individual documents
  let vectors = [];
  const delay = (ms = 20000) => new Promise((r) => setTimeout(r, ms));
  for(let index=0;index<documents.flat().length;index++){
    await delay();
    const res = await embedDocument(documents.flat()[index]);
    vectors.push(res);
  }
  console.log(vectors);
  // 4. Upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chatpdf");

  console.log("Inserting vectors into pinecone");
//   const namesapce = convertToAscii(file_key);

//   PineConeUtils.chunkedUpsert(pineconeIndex,vectors,namesapce,10);
    const namespace = pineconeIndex.namespace(convertToAscii(file_key));
    await namespace.upsert(vectors);

    return documents[0];

};

async function embedDocument(doc) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

const truncateStringByBytes = (str, bytes) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};
async function prepareDocument(page) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}

module.exports = {
  getPineconeClient,
  loadS3IntoPinecone,
  truncateStringByBytes,
};
