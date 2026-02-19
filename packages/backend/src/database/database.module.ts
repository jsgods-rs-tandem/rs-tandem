import { Global, Module } from '@nestjs/common';
import { pgPoolProvider } from './database.provider.js';

@Global()
@Module({
  providers: [pgPoolProvider],
  exports: [pgPoolProvider],
})
export class DatabaseModule {}
