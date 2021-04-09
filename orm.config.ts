import dotenv from 'dotenv';

import { __prod__ } from './src/constants';

dotenv.config();

export default {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: !__prod__,
  synchronize: true,
} as const;
