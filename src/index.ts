/**
 * NASA Data Explorer API - Main Application Entry Point
 * 
 * This file sets up the Express application with middleware, routes, and error handlers.
 * It configures CORS, security headers, logging, and Swagger documentation.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import nasaRoutes from './routes/nasaRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import { HealthResponse } from './types/api.types';
import { HTTP_STATUS } from './utils/constants';
import { specs } from './utils/swagger';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 8000;
const IS_PROD = (process.env.NODE_ENV || '').toLowerCase() === 'production';

// Global process-level error handlers to prevent server crashes
process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ err: error }, 'Uncaught Exception');
});

app.use(helmet());

// Derive allowed CORS origins
const DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

// FRONTEND_ORIGIN can be a comma-separated list for production
const PROD_ORIGINS = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: IS_PROD ? (PROD_ORIGINS.length > 0 ? PROD_ORIGINS : false) : DEV_ORIGINS,
    credentials: true,
  })
);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting to protect upstream and our API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NASA Data Explorer API Documentation',
}));

app.get('/health', (req: express.Request, res: express.Response<HealthResponse>) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'OK',
    message: 'NASA Data Explorer API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', nasaRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, `NASA Data Explorer API running on port ${PORT}`);
    logger.info({ env: process.env.NODE_ENV || 'development' }, 'Environment');
    logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
