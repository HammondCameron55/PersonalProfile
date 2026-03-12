import { z } from 'zod';
import { DynamicTool } from '@langchain/core/tools';
import fetch from 'node-fetch';
import { config } from '../../config.js';
const tavilyEndpoint = 'https://api.tavily.com/search';
export const webSearchSchema = z.object({
    query: z
        .string()
        .min(3, 'Query is too short')
        .max(512, 'Query is too long')
        .describe("User's web search query for current/external information.")
});
export const webSearchTool = new DynamicTool({
    name: 'web_search',
    description: 'Use this tool for up-to-date external information, such as news, recent events, current pricing, or anything likely to have changed after the model training data.',
    func: async (input) => {
        const parsed = webSearchSchema.safeParse({ query: input });
        if (!parsed.success) {
            return 'Error: invalid web search query.';
        }
        if (!config.tavilyApiKey) {
            return 'Web search is not available: Tavily API key is not configured.';
        }
        const body = {
            api_key: config.tavilyApiKey,
            query: parsed.data.query,
            max_results: 5,
            search_depth: 'basic',
            include_answer: true,
            include_raw_content: false
        };
        try {
            const response = await fetch(tavilyEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                return `Web search failed with status ${response.status}`;
            }
            const data = (await response.json());
            const lines = [];
            if (data.answer) {
                lines.push(`Summary: ${data.answer}`);
            }
            if (data.results && data.results.length > 0) {
                lines.push('', 'Top results:');
                for (const result of data.results.slice(0, 5)) {
                    const title = result.title ?? 'Untitled';
                    const url = result.url ?? 'Unknown URL';
                    const snippet = result.content
                        ? result.content.slice(0, 300).replace(/\s+/g, ' ')
                        : '';
                    lines.push(`- ${title} — ${snippet}${snippet ? '...' : ''} (${url})`);
                }
            }
            else if (!data.answer) {
                lines.push('No relevant web results found.');
            }
            return lines.join('\n');
        }
        catch {
            return 'Web search error: unable to reach Tavily API.';
        }
    }
});
