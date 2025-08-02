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

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  })
);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`NASA Data Explorer API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
