import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { registerApiRoute } from "@mastra/core/server";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { flashcardWorkflow } from "./workflows/flashcard-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { flashcardAgent } from "./agents/flashcard-agent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow, flashcardWorkflow },
  agents: { weatherAgent, flashcardAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
