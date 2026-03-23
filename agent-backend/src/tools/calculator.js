import { create, all } from "mathjs";
import { tool } from "langchain";
import { z } from "zod";

const math = create(all);
const schema = z.object({
  expression: z.string().min(1),
});

export function createCalculatorTool(toolTracker) {
  return tool(
    async ({ expression }) => {
      toolTracker("calculator");
      try {
        const result = math.evaluate(expression);
        if (typeof result === "object") {
          return "Unable to format calculation result.";
        }
        return `Result: ${String(result)}`;
      } catch (error) {
        return `Invalid expression: ${error.message}`;
      }
    },
    {
      name: "calculator",
      description: "Use for arithmetic, percentages, and numeric reasoning.",
      schema,
    },
  );
}
