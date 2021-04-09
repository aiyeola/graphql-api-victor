import dotenv from 'dotenv';

dotenv.config();

export default {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: true,
} as const;
