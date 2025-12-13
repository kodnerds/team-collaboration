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

  // Swagger documentation
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
  });
};

main();
