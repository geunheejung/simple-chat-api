import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import sseRoutes from './routes/sse.routes.js';
import { errorHandler, notFound } from './middlewares/error.js';
import { broadcastUnread, makeFakeInternal, notifications } from './lib/notifications.js';


const createApp = () => {
  const app = express();
  app.use(cors({
    credentials: true,
    origin: `http://localhost:3000`,    
    allowedHeaders: ['Content-Type', "Authorization", "X-CSRF-Token"]
  }));

  app.use(express.json());

  app.use('/auth', authRoutes);

  app.use('/', sseRoutes)

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const PORT = process.env.PORT || 4000;
const app = createApp();

/**
 * 주기적으로 새 알림 추가
 */
setInterval(() => {
  const n = makeFakeInternal();
  notifications.unshift(n);
  broadcastUnread();
}, 15_000);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
