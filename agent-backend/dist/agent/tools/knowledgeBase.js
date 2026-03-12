import { z } from 'zod';
import { createTool } from '@langchain/core/tools';
export const knowledgeBaseSchema = z.object({
    query: z
        .string()
        .min(3, 'Query is too short')
        .max(512, 'Query is too long')
        .describe('Query over Cameron’s curated knowledge base (resume, selected docs, portfolio materials).')
});
export const knowledgeBaseTool = createTool({
    name: 'knowledge_base',
    description: 'Use this tool to look up factual information about Cameron, his experience, and his documented projects in the curated knowledge base. Prefer this over web_search for questions about Cameron specifically.',
    schema: knowledgeBaseSchema,
    async invoke(input) {
        // Placeholder implementation for future RAG integration.
        const parsed = knowledgeBaseSchema.parse(input);
        return `Knowledge base search is not yet implemented. In a future version, this would search Cameron's curated documents for: "${parsed.query}".`;
    }
});
