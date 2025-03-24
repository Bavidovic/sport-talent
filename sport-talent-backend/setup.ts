import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.test
dotenv.config({ path: resolve(__dirname, '.env.test') });