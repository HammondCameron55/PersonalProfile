import { tavily } from "@tavily/core";
import { tool } from "langchain";
import { z } from "zod";
import { logToolComplete, logToolFailure, logToolInvoked } from "../logger.js";

const schema = z.object({
  query: z.string().min(2),
});

export function createWebSearchTool({ apiKey, maxResults, depth, toolTracker, traceId }) {
  const client = tavily({
    apiKey,
  });

  return tool(
    async ({ query }) => {
      toolTracker("web_search");
      const argsSummary = JSON.stringify({ query });
      logToolInvoked(traceId, "web_search", argsSummary);
      const started = Date.now();

      if (!apiKey) {
        const msg = "Web search is unavailable because TAVILY_API_KEY is not configured.";
        logToolComplete(traceId, "web_search", argsSummary, msg, false, Date.now() - started);
        return msg;
      }

      try {
        const response = await client.search(query, {
          maxResults,
          searchDepth: depth,
        });

        const lines = (response.results || []).slice(0, maxResults).map((item, index) => {
          const title = item.title || "Untitled source";
          return `${index + 1}. ${title}\nURL: ${item.url}\nSnippet: ${item.content || "No snippet provided."}`;
        });

        if (!lines.length) {
          const msg = "No web results were found for that query.";
          logToolComplete(traceId, "web_search", argsSummary, msg, true, Date.now() - started);
          return msg;
        }

        const body = lines.join("\n\n");
        logToolComplete(traceId, "web_search", argsSummary, body, true, Date.now() - started);
        return body;
      } catch (error) {
        const msg = error?.message || String(error);
        logToolFailure(traceId, "web_search", argsSummary, error, Date.now() - started);
        if (/401|403|Unauthorized|invalid api key|API key/i.test(msg)) {
          return `Web search failed: Tavily rejected the API key (HTTP auth). Copy a fresh key from https://app.tavily.com/home and set TAVILY_API_KEY in .env with no extra spaces. Raw: ${msg}`;
        }
        return `Web search failed: ${msg}`;
      }
    },
    {
      name: "web_search",
      description: "Use for fresh, external information like recent news, pricing, or events.",
      schema,
    },
  );
}
