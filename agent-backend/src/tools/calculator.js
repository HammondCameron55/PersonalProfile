import { create, all } from "mathjs";
import { tool } from "langchain";
import { z } from "zod";
import { logToolComplete, logToolFailure, logToolInvoked } from "../logger.js";

const math = create(all);
const schema = z.object({
  expression: z.string().min(1),
});

export function createCalculatorTool({ toolTracker, traceId }) {
  return tool(
    async ({ expression }) => {
      toolTracker("calculator");
      const argsSummary = JSON.stringify({ expression });
      logToolInvoked(traceId, "calculator", argsSummary);
      const started = Date.now();
      try {
        const result = math.evaluate(expression);
        if (typeof result === "object") {
          const msg = "Unable to format calculation result.";
          logToolComplete(traceId, "calculator", argsSummary, msg, false, Date.now() - started);
          return msg;
        }
        const out = `Result: ${String(result)}`;
        logToolComplete(traceId, "calculator", argsSummary, out, true, Date.now() - started);
        return out;
      } catch (error) {
        const out = `Invalid expression: ${error.message}`;
        logToolFailure(traceId, "calculator", argsSummary, error, Date.now() - started);
        return out;
      }
    },
    {
      name: "calculator",
      description: "Use for arithmetic, percentages, and numeric reasoning.",
      schema,
    },
  );
}
