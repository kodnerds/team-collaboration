import express, { urlencoded, json } from 'express';
import routes from './routes';

const PORT = process.env.PORT || 3002;

const main = async () => {
  const app = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/', (_, res) => {
    res.send({ message: 'Welcome to the Jobboard API!' });
  });

  app.use('/api/v1', routes);

  app.listen(PORT, () => {
    console.info(`Api running on http://localhost:${PORT}`);
  });
};

main();
