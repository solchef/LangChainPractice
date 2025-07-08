import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseClient } from '@supabase/supabase-js';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
// import  { Document } from "@langchain/core/documents";


const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const client = new SupabaseClient(sbUrl, sbApiKey)
const pineconeApiKey = import.meta.env.VITE_PINECONE_API_KEY;
const pineconeIndexName = import.meta.env.VITE_PINECONE_INDEX_NAME;
const pineconeEnvironment = import.meta.env.VITE_PINECONE_ENVIRONMENT;

// const pc = new Pinecone({
//   apiKey: pineconeApiKey
// });
const pinecone = new Pinecone({ apiKey: pineconeApiKey });

console.log(pinecone)
const index = pinecone.Index(pineconeIndexName);

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  index,
  // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  maxConcurrency: 5,
  // You can pass a namespace here too
  // namespace: "foo",
});


// This code fetches a text file, splits it into chunks, and creates a vector store using Pinecone.

try {
    
const result = await fetch('/scrimba-info.txt')
const text = await result.text()
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ['\n\n', '\n', ' ', ''],
    chunkOverlap: 50
})
const output = await splitter.createDocuments([text])
// console.log(output)


// using supabase as the vector store
// await SupabaseVectorStore.fromDocuments(
//   output,
//   new OpenAIEmbeddings({ openAIApiKey }),
//   {
//     client,
//     tableName: 'documents',
//     // queryName: 'search'
//   }
// )

// using pinecone as the vector store

await PineconeStore.fromDocuments(
    output,
    embeddings,
    {
      apiKey: pineconeApiKey,
      indexName: pineconeIndexName,
      environment: pineconeEnvironment,
    }
  );
console.log('Vector store created successfully from text file!');

} catch (error) {
    console.error('Error creating store from text:', error);
    throw error;
}
