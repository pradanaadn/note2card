import { embedMany, EmbedManyResult } from "ai";
import { MDocument, ChunkStrategy } from "@mastra/rag";

import { google } from "@ai-sdk/google";
import { appConfig } from "../../config";
import { config } from "dotenv";

config();

enum TextType {
  MD = "text",
  TEXT = "image",
  HTML = "html",
  JSON = "json",
}

export class GeminiTextEmbedding {
  model: ReturnType<typeof google.textEmbeddingModel>;

  constructor(model: string) {
    this.model = google.textEmbeddingModel(model);
  }

  async chunkingText(
    text: string,
    textType: TextType,
    maxSize: number = 1024,
    overlap: number = 256,
  ): Promise<MDocument> {
    let document: MDocument;
    switch (textType) {
      case TextType.MD:
        document = MDocument.fromMarkdown(text);
        break;
      case TextType.TEXT:
        document = MDocument.fromText(text);
        break;
      case TextType.HTML:
        document = MDocument.fromHTML(text);
        break;
      case TextType.JSON:
        document = MDocument.fromJSON(text);
        break;
      default:
        throw new Error(`Unsupported text type: ${textType}`);
    }

    await document.chunk({
      strategy: "recursive",
      maxSize: maxSize,
      overlap: overlap,
      separators: ["\n\n", "\n", " ", ""],
    });

    return document;
  }

  /**
   *
   * @param document
   * @returns
   */
  async embedText(document: MDocument): Promise<EmbedManyResult<string>> {
    const chunks = document.getDocs();
    if (!chunks.length) {
      throw new Error("No chunks found");
    }
    const embedding = await embedMany({
      model: this.model,
      values: chunks.map((chunk) => chunk.text),
    });
    return embedding;
  }
}

const embedding = new GeminiTextEmbedding("gemini-embedding-001");
const chunkDocuments = await embedding.chunkingText(
  "Hello, world",
  TextType.TEXT,
);
const embedDocuments = await embedding.embedText(chunkDocuments);
