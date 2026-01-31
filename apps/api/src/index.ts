import 'reflect-metadata';

import cors from 'cors';
import express, { urlencoded, json } from 'express';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import swaggerConfig from '../docs/swagger.config';

import envConfig from './config/envConfig';
import { AppDataSource } from './database';
import routes from './routes';
import { HTTP_STATUS } from './utils/const';
import logger from './utils/logger';

const PORT = envConfig.PORT || 3000;

const main = async () => {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );

  app.use(helmet());

  await AppDataSource.initialize();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/', (_, res) => {
    res.send({ message: 'Welcome to the TC API!' });
  });

  // Health check endpoint for Render and monitoring
  app.get('/api/health', async (_, res) => {
    try {
      const isDbConnected = AppDataSource.isInitialized;
      if (isDbConnected) {
        await AppDataSource.query('SELECT 1');
      }

      res.status(HTTP_STATUS.OK).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: isDbConnected ? 'connected' : 'disconnected'
      });
    } catch {
      res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'error'
      });
    }
  });

  const swaggerSpec = swaggerJsdoc(swaggerConfig);
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Team Collaboration API Documentation'
    })
  );

  app.use('/api/v1', routes);

  app.listen(PORT, () => {
    logger.info(`Api running on http://localhost:${PORT}`);
    logger.info(`API documentation available at http://localhost:${PORT}/docs`);
  });
};

main();
