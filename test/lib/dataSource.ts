import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Ts3BlackListEntity } from '../../src/entity/Ts3BlackListEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'ts3blacklist',
  synchronize: true,
  logging: true,
  entities: [Ts3BlackListEntity],
  subscribers: [],
  migrations: [],
});
