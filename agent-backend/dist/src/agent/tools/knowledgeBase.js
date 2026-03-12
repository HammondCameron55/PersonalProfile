import { z } from 'zod';
import { DynamicTool } from '@langchain/core/tools';
export const knowledgeBaseSchema = z.object({
    query: z
        .string()
        .min(3, 'Query is too short')
        .max(512, 'Query is too long')
        .describe('Query over Cameron’s curated knowledge base (resume, selected docs, portfolio materials).')
});
export const knowledgeBaseTool = new DynamicTool({
    name: 'knowledge_base',
    description: 'Use this tool to look up factual information about Cameron, his experience, and his documented projects in the curated knowledge base. Prefer this over web_search for questions about Cameron specifically.',
    func: async (input) => {
        const parsed = knowledgeBaseSchema.safeParse({ query: input });
        if (!parsed.success) {
            return 'Error: invalid knowledge base query.';
        }
        return `Knowledge base search is not yet implemented. In a future version, this would search Cameron's curated documents for: "${parsed.data.query}".`;
    }
});
