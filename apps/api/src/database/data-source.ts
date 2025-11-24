import 'reflect-metadata';
import { DataSource } from 'typeorm';

import envConfig from '../config/envConfig';

import type { DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.POSTGRES_HOST,
  port: envConfig.POSTGRES_PORT,
  username: envConfig.POSTGRES_USER,
  password: envConfig.POSTGRES_PASSWORD,
  database: envConfig.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [process.env.NODE_ENV === 'production' ? 'dist/entity/**/*.js' : 'src/entity/**/*.ts'],
  migrations: [],
  subscribers: []
});

export const testDatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 2345,
  username: 'root',
  database: 'test',
  password: process.env.TEST_DB_PASSWORD || 'easypass',
  synchronize: true,
  dropSchema: true,
  entities: ['src/entities/**/*.ts']
};

export const TestDataSource = new DataSource(testDatabaseConfig);
