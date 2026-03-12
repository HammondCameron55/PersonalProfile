import { z } from 'zod';
import { createTool } from '@langchain/core/tools';
import { create, all } from 'mathjs';
const math = create(all, {});
export const calculatorSchema = z.object({
    expression: z
        .string()
        .min(1, 'Expression is required')
        .max(200, 'Expression is too long')
        .regex(/^[0-9+\-*/().,\s%^]+$/u, 'Expression contains unsupported characters')
        .describe("Mathematical expression to evaluate, e.g. '1523 * 456 / 3'.")
});
export const calculatorTool = createTool({
    name: 'calculator',
    description: 'Use this tool for arithmetic and numeric reasoning where precision is important, especially multi-step calculations, percentages, and large numbers. Do not guess; prefer this tool over mental math.',
    schema: calculatorSchema,
    async invoke(input) {
        const parsed = calculatorSchema.parse(input);
        try {
            const result = math.evaluate(parsed.expression);
            return String(result);
        }
        catch (err) {
            return 'Error: invalid expression';
        }
    }
});
