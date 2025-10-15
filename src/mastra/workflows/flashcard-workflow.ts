import * as z from 'zod';
import { createStep, createWorkflow } from '@mastra/core/workflows';


const flashcardOutputSchema = z.array(z.object({
    front: z.string().min(1, "Question cannot be empty"),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    back: z.string().min(1, "Answer cannot be empty"),
}));



const fetchContext = createStep({
    id: 'fetch-context',
    description: 'Fetches context for flashcard creation',
    inputSchema: z.object({
        text: z.string().min(1, "Input text cannot be empty").describe('The text to create flashcards from'),
    }),
    outputSchema: z.object({
        context: z.string().min(1, "Context cannot be empty"),
    }),
    execute: async ({ inputData }) => {
        if (!inputData) {
            throw new Error('Input data not found');
        }

        return { context: inputData.text };
    }
});


const createFlashcards = createStep({
    id: 'create-flashcards',
    description: 'Creates flashcards from the provided context',
    inputSchema: z.object({
        context: z.string().min(1, "Context cannot be empty"),
    }),
    outputSchema: flashcardOutputSchema,
    execute: async ({ inputData, mastra }) => {
        if (!inputData) {
            throw new Error('Input data not found');
        }

        const agent = mastra.getAgent('flashcardAgent');
        if (!agent) {
            throw new Error('Flashcard Agent not found');
        }

        const response = await agent.generate(`Create flashcards from the following text:\n\n${inputData.context}\n\nFormat the flashcards in a simple JSON format: [{"front": "Question text", "difficulty": "easy|medium|hard", "back": "Answer text"}, ...]`);

        try {
            const parsed = flashcardOutputSchema.parse(JSON.parse(response.text));
            return parsed;
        } catch (error) {
            throw new Error('Failed to parse flashcards from agent response');
        }
    }
});

const flashcardWorkflow = createWorkflow({
    id: 'Flashcard Creation Workflow',
    description: 'A workflow to create flashcards from user-provided text.',
    inputSchema: z.object({
        text: z.string().min(1, "Input text cannot be empty").describe('The text to create flashcards from'),
    }),
    outputSchema: flashcardOutputSchema
})

flashcardWorkflow.commit();

export { flashcardWorkflow };
