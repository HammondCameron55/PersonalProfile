import { tavily } from "@tavily/core";
import { tool } from "langchain";
import { z } from "zod";

const schema = z.object({
  query: z.string().min(2),
});

export function createWebSearchTool({ apiKey, maxResults, depth, toolTracker }) {
  const client = tavily({
    apiKey,
  });

  return tool(
    async ({ query }) => {
      toolTracker("web_search");
      if (!apiKey) {
        return "Web search is unavailable because TAVILY_API_KEY is not configured.";
      }

      try {
        const response = await client.search(query, {
          max_results: maxResults,
          search_depth: depth,
        });

        const lines = (response.results || []).slice(0, maxResults).map((item, index) => {
          const title = item.title || "Untitled source";
          return `${index + 1}. ${title}\nURL: ${item.url}\nSnippet: ${item.content || "No snippet provided."}`;
        });

        if (!lines.length) {
          return "No web results were found for that query.";
        }

        return lines.join("\n\n");
      } catch (error) {
        return `Web search failed: ${error.message}`;
      }
    },
    {
      name: "web_search",
      description: "Use for fresh, external information like recent news, pricing, or events.",
      schema,
    },
  );
}
