import 'reflect-metadata';
import { DataSource } from 'typeorm';

import envConfig from '../config/envConfig';

// Detect if running as compiled JS (from dist folder)
const isCompiled = __dirname.includes('dist');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.POSTGRES_HOST,
  port: envConfig.POSTGRES_PORT,
  username: envConfig.POSTGRES_USER,
  password: envConfig.POSTGRES_PASSWORD,
  database: envConfig.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [isCompiled ? 'dist/src/entities/**/*.js' : 'src/entities/**/*.ts'],
  migrations: [isCompiled ? 'dist/src/migrations/**/*.js' : 'src/migrations/**/*.ts'],
  subscribers: []
});

// Only default export for TypeORM CLI
export default AppDataSource;
