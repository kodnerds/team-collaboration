import { DataSource } from 'typeorm';

import type { DataSourceOptions } from 'typeorm';

export const testDatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 2345,
  username: 'root',
  database: 'test',
  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  password: 'easypass',
  synchronize: true,
  dropSchema: true,
  entities: ['src/entities/**/*.ts']
};

export const TestDataSource = new DataSource(testDatabaseConfig);
