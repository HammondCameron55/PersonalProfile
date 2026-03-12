import type { Request, Response } from 'express';
import { z } from 'zod';
import { createAgent, type ChatMessage } from '../agent/index.js';
import { logger } from '../logger.js';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string()
      })
    )
    .optional()
});

export function createChatHandler() {
  const agent = createAgent();

  return async function chatHandler(req: Request, res: Response) {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn({
        level: 'warn',
        route: '/api/chat',
        error: parsed.error.flatten()
      });
      res.status(400).json({
        error: { type: 'validation_error', message: 'Invalid request payload' }
      });
      return;
    }

    const { message, history = [] } = parsed.data;

    const messages: ChatMessage[] = [
      ...history,
      { role: 'user', content: message }
    ];

    const requestId = globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    logger.info({
      route: '/api/chat',
      requestId,
      event: 'request_received',
      messagePreview: message.slice(0, 120),
      messageLength: message.length
    });

    try {
      const result = await agent.invoke({ messages });
      const content = typeof result === 'string' ? result : result.content;

      logger.info({
        route: '/api/chat',
        requestId,
        event: 'response_generated'
      });

      res.json({
        reply: content,
        requestId
      });
    } catch (err) {
      logger.error({
        route: '/api/chat',
        requestId,
        event: 'error',
        error:
          err instanceof Error
            ? { message: err.message, stack: err.stack }
            : String(err)
      });

      res.status(500).json({
        error: {
          type: 'server_error',
          message:
            'Sorry, something went wrong while generating a response. Please try again.'
        }
      });
    }
  };
}

