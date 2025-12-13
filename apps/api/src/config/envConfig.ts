import { cleanEnv, port, str } from 'envalid';
import 'dotenv/config';

const envConfig = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  POSTGRES_USER: str({ default: undefined }),
  POSTGRES_PASSWORD: str({ default: undefined }),
  POSTGRES_DB: str({ default: undefined }),
  POSTGRES_PORT: port({ default: undefined }),
  POSTGRES_HOST: str({ default: undefined }),
  LOG_LEVEL: str({ default: 'debug' }),
  ACCESS_TOKEN_SECRET: str({ default: undefined }),
  MAILGUN_DOMAIN: str({ default: 'sandboxd04c8ae18b03487a807336b787df65a9.mailgun.org' }),
  MAILGUN_API_KEY: str({ default: undefined}),
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),
});

const extendedEnvConfig = {
  ...envConfig,
  get isTest() {
    return envConfig.NODE_ENV === 'test';
  }
};

export default extendedEnvConfig;
