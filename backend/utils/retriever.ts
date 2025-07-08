import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY
});

const vectorizer = process.env.VECTOR_DATABASE; // "supabase" or "pinecone"

// let retriever;

console.log("Using vectorizer:", vectorizer);

export async function retriever() {

if (vectorizer === 'supabase') {
  console.log("✅ Using Supabase as the vector database");

  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!
  );

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
  });

  return vectorStore.asRetriever();

} else if (vectorizer === 'pinecone') {
  console.log("✅ Using Pinecone as the vector database");

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    maxConcurrency: 5,
  });

  return vectorStore.asRetriever();

} else {
  throw new Error("❌ VECTOR_DATABASE environment variable must be 'supabase' or 'pinecone'");
}
}

