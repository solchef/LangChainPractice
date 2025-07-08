// backend/vectorize.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const processText = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.createDocuments([text]);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pineconeApiKey = process.env.PINECONE_API_KEY;
  if (!pineconeApiKey) {
    throw new Error("PINECONE_API_KEY environment variable is not set.");
  }
  const pinecone = new Pinecone({ apiKey: pineconeApiKey });
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
  });

  return { success: true, chunks: docs.length };
};
