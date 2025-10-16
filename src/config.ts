import * as z from "zod";
import "dotenv/config";

type llm = {
  GOOGLE_GENERATIVE_AI_API_KEY: string;
};

type qdrant = {
  API_KEY: string;
  LOG_LEVEL: string;
  HTTP_PORT: number | string;
  GRPC_PORT: number | string;
};

type config = {
  llm: llm;
  qdrant: qdrant;
};

export const appConfig: config = {
  llm: {
    GOOGLE_GENERATIVE_AI_API_KEY:
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
  },
  qdrant: {
    API_KEY: process.env.QDRANT_API_KEY || "",
    LOG_LEVEL: process.env.QDRANT_LOG_LEVEL || "info",
    HTTP_PORT: process.env.QDRANT_HTTP_PORT || 6335,
    GRPC_PORT: process.env.QDRANT_GRPC_PORT || 6334,
  },
};

console.log(appConfig);
