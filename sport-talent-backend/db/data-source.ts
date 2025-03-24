import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js']
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
