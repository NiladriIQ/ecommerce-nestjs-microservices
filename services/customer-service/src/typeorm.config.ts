import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Customer } from './customer/customer.entity';
import { OrderHistory } from './customer/order-history.entity';

config(); // Load .env file

const isProduction = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'customer_db',
  entities: [Customer, OrderHistory],
  migrations: [
    isProduction
      ? __dirname + '/db/migrations/*.js'
      : __dirname + '/db/migrations/*.ts',
  ],
  migrationsTableName: 'migrations',
  synchronize: false, // Always false when using migrations
  migrationsRun: false, // Don't auto-run migrations on app start
  logging: process.env.NODE_ENV === 'development',
  extra: {
    max: 10, // Maximum number of connections in the pool
    connectionTimeoutMillis: 2000, // Connection timeout
  },
};

export default new DataSource(dataSourceOptions);
