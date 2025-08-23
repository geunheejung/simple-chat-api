import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import { errorHandler, notFound } from './middlewares/error.js';

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/auth', authRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});