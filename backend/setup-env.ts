import { config } from 'dotenv';
process.env.NODE_ENV = 'test';
config({ path: __dirname + '/.env.test', override: true });
