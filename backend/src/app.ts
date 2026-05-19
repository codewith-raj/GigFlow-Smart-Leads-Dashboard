import 'express-async-errors';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { globalErrorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'GigFlow Smart Leads API is healthy',
      data: {
        service: 'gigflow-smart-leads-dashboard-api',
        version: '1.0.0',
      },
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  app.use(globalErrorHandler);

  return app;
};

export default createApp;
