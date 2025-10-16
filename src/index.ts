import express, { Request, Response } from "express";
import { mastra } from "./mastra";
import {
  TextType,
  GeminiTextEmbedding,
} from "./mastra/documents/text-embedding";
const app = express();
const port = 3456;
const embedding = new GeminiTextEmbedding("gemini-embedding-001");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.post("/api/note", async (req: Request, res: Response) => {
  const { title, content, topic } = req.body;
  const chunkDocuments = await embedding.chunkingText(content, TextType.TEXT);
  const embeddingResult = await embedding.embedText(chunkDocuments);
  res.send(embeddingResult);
});

app.get("/api/weather", async (req: Request, res: Response) => {
  const { city } = req.query as { city?: string };

  if (!city) {
    return res.status(400).send("Missing 'city' query parameter");
  }

  const agent = mastra.getAgent("weatherAgent");

  try {
    const result = await agent.generate(`What's the weather like in ${city}?`);
    res.send(result.text);
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).send("An error occurred while processing your request");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
