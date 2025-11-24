import { testDatabaseConfig } from '../../src/database';

import { setupPostgresContainer } from './testcontainer';

import type { PostgresConfig } from './testcontainer';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// Set up environment variables for tests
process.env.ACCESS_TOKEN_SECRET = 'test_secret_key_for_jwt_tokens';
process.env.NODE_ENV = 'test';

const postgresConfig = testDatabaseConfig as PostgresConnectionOptions;

const connectionConfig: PostgresConfig = {
  username: postgresConfig.username as string,
  password: postgresConfig.password as string,
  port: postgresConfig.port as number,
  database: postgresConfig.database as string
};

const jestSetup = async () => {
  await setupPostgresContainer(connectionConfig);
};

export default jestSetup;
