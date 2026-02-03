import envConfig from '../config/envConfig';

import AppDataSource from './data-source';
import { TestDataSource } from './test-data-source';

import type { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export const connect = <T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> =>
  envConfig.isTest
    ? TestDataSource.manager.getRepository(entity)
    : AppDataSource.manager.getRepository(entity);
