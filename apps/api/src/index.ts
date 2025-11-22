import 'reflect-metadata';
import express, { urlencoded, json } from 'express';
import helmet from 'helmet';

import envConfig from './config/envConfig';
import { connectToDatabase } from './database';
import routes from './routes';
import logger from './utils/logger';

const PORT = envConfig.PORT || 3001;

const main = async () => {
  const app = express();

  app.use(helmet());

  await connectToDatabase();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/', (_, res) => {
    res.send({ message: 'Welcome to the Jobboard API!' });
  });

  app.use('/api/v1', routes);

  app.listen(PORT, () => {
    logger.info(`Api running on http://localhost:${PORT}`);
  });
};

main();
