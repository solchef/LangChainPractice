import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseClient } from '@supabase/supabase-js';

const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const client = new SupabaseClient(sbUrl, sbApiKey)

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



await SupabaseVectorStore.fromDocuments(
  output,
  new OpenAIEmbeddings({ openAIApiKey }),
  {
    client,
    tableName: 'documents',
    // queryName: 'search'
  }
)

} catch (error) {
    console.error('Error creating store from text:', error);
    throw error;
}
