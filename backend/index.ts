// backend/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import multer from "multer";
import pdfParse from "pdf-parse";
import fs from 'fs/promises';
import { chain } from './main';
import { formatConvHistory } from './utils/formatConvHistory';

import { processText } from "./vectorize";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
    console.log("Received GET request at /");
    res.send("Welcome to the Vectorization API");
});

app.post("/api/vectorize", upload.single('file'), async (req: any, res: any) => {
    try {
        // const text = await fs.readFile('./scrimba-info.txt', 'utf-8');
        // const result = await processText(text);
        // res.json(result);
        console.log(req.file)
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        // Extract text from PDF
        const data = await pdfParse(file.buffer);
        console.log(data);
        const text = data.text;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Empty PDF content" });
        }

        // Pass extracted text to your vectorization logic
        const result = await processText(text);
        res.json({ message: "Vectorization complete", ...result });

    } catch (err) {
        console.error("Vectorize error:", err);
        res.status(500).json({ error: "Vectorization failed" });
    }
});

let convHistory: any[] = [];

app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const formattedHistory = formatConvHistory(convHistory);

    const response = await chain.invoke({
      question,
      conv_history: formattedHistory
    });

    convHistory.push(question);
    convHistory.push(response);

    res.json({ answer: response });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'AI retrieval failed' });
  }
});
app.get('/history', (req, res) => {
  res.json(convHistory);
});

app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
});
