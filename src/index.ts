import express, { Request, Response } from "express";
import { mastra } from "@/mastra";
import {
  TextType,
  GeminiTextEmbedding,
} from "@/mastra/documents/text-embedding";
import { appConfig } from "@/config";
import { VectorStoreSingleton } from "@/mastra/db/vector-store";
import logger from "@/logger";

const app = express();
const port = 3456;

const embedding = new GeminiTextEmbedding("gemini-embedding-001");

const vectorStore = VectorStoreSingleton.getInstance(
  `${appConfig.qdrant.BASE_URL}:${appConfig.qdrant.HTTP_PORT}`,
  appConfig.qdrant.API_KEY,
  false,
);

await vectorStore.createCollection(appConfig.qdrant.COLLECTION_NAME);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.post("/api/note", async (req: Request, res: Response) => {
  const { title, content, topic } = req.body;
  const chunkDocuments = await embedding.chunkingText(content, TextType.TEXT);

  const list_id = chunkDocuments.getDocs().map((doc) => doc.id_);
  const metadata: { text: string; title: string; topic: string }[] =
    chunkDocuments.getDocs().map((doc) => ({
      text: doc.text,
      title,
      topic,
    }));

  const embeddingResult = await embedding.embedText(chunkDocuments);
  const vector = embeddingResult.embeddings;

  await vectorStore.addDocuments(
    appConfig.qdrant.COLLECTION_NAME,
    vector,
    metadata,
  );

  res.send(metadata);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
