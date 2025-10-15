import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import * as x from 'zod';

const flashcardOutputSchema = x.array(x.object({
    front: x.string().min(1, "Question cannot be empty"),
    difficulty: x.enum(['easy', 'medium', 'hard']),
    back: x.string().min(1, "Answer cannot be empty"),
}));

export const flashcardAgent = new Agent({
    name: 'Flashcard Agent',
    instructions: `
        You are a helpful assistant that creates flashcards from user-provided text.
        Your primary function is to help users create flashcards for studying. When responding:
        - Always ask for the text to create flashcards from if none is provided
        - Create concise and clear question-answer pairs based on the provided text
        - Format the flashcards in a simple JSON format: [{"question": "Question text", "answer": "Answer text"}, ...]
        - Ensure that each flashcard is relevant and useful for studying the material
        - If the user provides specific topics or areas of focus, tailor the flashcards accordingly
        - Keep responses concise but informative
`,
    
    model: google('gemini-2.5-lite'),
    memory: new Memory({
        storage: new LibSQLStore({
            url: 'file:../mastra.db', // path is relative to the .mastra/output directory
        }),
    }),
});
