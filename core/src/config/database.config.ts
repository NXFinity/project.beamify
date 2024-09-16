import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  pass: process.env.POSTGRES_PASSWORD,
  db: process.env.POSTGRES_DB,
}));
