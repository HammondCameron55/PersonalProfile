import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { config } from "./config.js";
import { runAgent } from "./agent.js";
import { appendToSession, getSessionHistory } from "./memory.js";
import { logEvent } from "./logger.js";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: config.allowedOrigin === "*" ? true : config.allowedOrigin,
  }),
);

const payloadSchema = z.object({
  message: z.string().min(1).max(5000),
  sessionId: z.string().min(4).max(200),
});

app.get("/api/agent/health", (_req, res) => {
  res.json({
    ok: true,
    service: "agent-backend",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/agent/chat", async (req, res) => {
  const traceId = crypto.randomUUID();
  const parsed = payloadSchema.safeParse(req.body);

  if (!parsed.success) {
    logEvent("error", "request.validation_failed", {
      traceId,
      issueCount: parsed.error.issues.length,
    });
    return res.status(400).json({
      error: "Invalid payload. Expected message and sessionId.",
      traceId,
    });
  }

  const { message, sessionId } = parsed.data;
  logEvent("info", "request.received", {
    traceId,
    sessionId,
    messagePreview: message.slice(0, 120),
  });

  try {
    if (!config.geminiApiKey) {
      return res.status(503).json({
        error: "Agent is not configured yet. Missing GEMINI_API_KEY.",
        traceId,
      });
    }

    const history = getSessionHistory(sessionId);
    const result = await runAgent({
      message,
      history,
    });

    appendToSession(sessionId, message, result.answer, config.memoryTurns);
    logEvent("info", "agent.completed", {
      traceId,
      sessionId,
      toolsUsed: result.toolsUsed,
      answerPreview: result.answer.slice(0, 120),
    });

    return res.json({
      answer: result.answer,
      toolsUsed: result.toolsUsed,
      sessionId,
      traceId,
    });
  } catch (error) {
    logEvent("error", "agent.failed", {
      traceId,
      sessionId,
      errorMessage: error.message,
    });
    return res.status(500).json({
      error: "Something went wrong while generating a response. Please try again.",
      traceId,
    });
  }
});

app.listen(config.port, () => {
  logEvent("info", "server.started", {
    port: config.port,
    allowedOrigin: config.allowedOrigin,
  });
});
