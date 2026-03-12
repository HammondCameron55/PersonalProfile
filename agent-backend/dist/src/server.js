import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { config, assertConfig } from './config.js';
import { logger } from './logger.js';
import { createChatHandler } from './routes/chat.js';
assertConfig();
const app = express();
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (config.allowedOrigins.length === 0)
            return callback(null, true);
        if (config.allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    }
}));
app.use(json({
    limit: config.maxRequestBodySizeBytes
}));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.post('/api/chat', createChatHandler());
const server = app.listen(config.port, () => {
    logger.info({
        event: 'server_started',
        port: config.port
    });
});
process.on('SIGTERM', () => {
    server.close(() => {
        logger.info({ event: 'server_stopped' });
        process.exit(0);
    });
});
