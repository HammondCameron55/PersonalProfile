import { z } from 'zod';
import { DynamicTool } from '@langchain/core/tools';
import { create, all } from 'mathjs';

const math = create(all, {});

export const calculatorSchema = z.object({
  expression: z
    .string()
    .min(1, 'Expression is required')
    .max(200, 'Expression is too long')
    .regex(
      /^[0-9+\-*/().,\s%^]+$/u,
      'Expression contains unsupported characters'
    )
    .describe("Mathematical expression to evaluate, e.g. '1523 * 456 / 3'.")
});

export const calculatorTool = new DynamicTool({
  name: 'calculator',
  description:
    'Use this tool for arithmetic and numeric reasoning where precision is important, especially multi-step calculations, percentages, and large numbers. Do not guess; prefer this tool over mental math.',
  func: async (input: string) => {
    const parsed = calculatorSchema.safeParse({ expression: input });
    if (!parsed.success) {
      return 'Error: invalid expression';
    }
    try {
      const result = math.evaluate(parsed.data.expression);
      return String(result);
    } catch {
      return 'Error: invalid expression';
    }
  }
});

