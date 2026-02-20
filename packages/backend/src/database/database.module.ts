import { Global, Module } from '@nestjs/common';
import { pgPoolProvider } from './database.provider.js';
import { DatabaseService } from './database.service.js';

@Global()
@Module({
  providers: [pgPoolProvider, DatabaseService],
  exports: [pgPoolProvider],
})
export class DatabaseModule {}
