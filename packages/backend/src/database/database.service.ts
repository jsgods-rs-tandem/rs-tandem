import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './database.constants.js';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
