import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');
    const databaseSchema = config.get<string>('DATABASE_SCHEMA');

    const adapter = new PrismaPg(
      { connectionString: databaseUrl! },
      { schema: databaseSchema },
    );

    super({
      adapter,
      log: ['warn', 'error'],
    });
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
  onModuleInit() {
    return this.$connect();
  }
}
