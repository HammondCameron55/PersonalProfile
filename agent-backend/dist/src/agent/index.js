import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { RunnableSequence } from '@langchain/core/runnables';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { calculatorTool } from './tools/calculator.js';
import { webSearchTool } from './tools/webSearch.js';
import { knowledgeBaseTool } from './tools/knowledgeBase.js';
import { config } from '../config.js';
const systemPrompt = `
You are an AI agent embedded in Cameron Hammond's recruiter-facing portfolio site.

Your goals:
- Answer questions about Cameron, his experience, and his work using the provided tools and knowledge.
- Explain agentic concepts (ReAct, tools, LangChain) in clear, grounded language when asked.
- Demonstrate use of tools (calculator, web_search, knowledge_base) rather than guessing.

Tool guidance:
- Use the calculator tool for arithmetic, percentages, and any numeric reasoning where precision matters.
- Use the web_search tool for up-to-date external information such as news, current events, and recent technologies.
- Use the knowledge_base tool (when implemented) for questions specifically about Cameron or documents in his curated knowledge base.

General behavior:
- Be concise and professional, but friendly.
- If tools are unavailable or return no results, say so clearly and answer based on your own knowledge with appropriate uncertainty.
`.trim();
export function createAgent() {
    const model = new ChatGoogleGenerativeAI({
        model: 'gemini-1.5-flash',
        apiKey: config.googleApiKey,
        temperature: 0.4,
        maxOutputTokens: 1024
    }).bindTools([calculatorTool, webSearchTool, knowledgeBaseTool]);
    const runnable = RunnableSequence.from([
        async (input) => {
            const history = input.messages.map((m) => {
                if (m.role === 'user')
                    return new HumanMessage(m.content);
                if (m.role === 'assistant')
                    return new AIMessage(m.content);
                return new SystemMessage(m.content);
            });
            return [
                new SystemMessage(systemPrompt),
                ...history
            ];
        },
        model
    ]);
    return runnable;
}
