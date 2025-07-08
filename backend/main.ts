import fs from 'fs/promises';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from './utils/retriever';
import { combineDocuments } from './utils/combineDocuments';

const llm = new ChatOpenAI({ openAIApiKey: process.env.VITE_OPENAI_API_KEY });

const standalonePrompt = PromptTemplate.fromTemplate(`
Given the conversation history and a user question, convert it to a standalone question.
conversation history: {conv_history}
question: {question}
standalone question:
`);

const answerPrompt = PromptTemplate.fromTemplate(`
You are a helpful support assistant. Use the provided context and conversation history to answer the question. 
If unsure, say "I'm sorry, I don't know the answer to that."
context: {context}
conversation history: {conv_history}
question: {question}
answer:
`);

const standaloneChain = standalonePrompt.pipe(llm).pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
  prev => prev.standalone_question,
  retriever,
  combineDocuments
]);

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneChain,
    original_input: new RunnablePassthrough()
  },
  {
    context: retrieverChain,
    question: ({ original_input }) => original_input.question,
    conv_history: ({ original_input }) => original_input.conv_history
  },
  answerChain
]);

export { chain };
