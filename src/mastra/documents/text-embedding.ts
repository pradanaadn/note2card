import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { appConfig } from "../../config";

const result = await embed({
  model: google.textEmbeddingModel("text-embedding-004"),
  value: "Hello, world!",
});

console.log(result);
