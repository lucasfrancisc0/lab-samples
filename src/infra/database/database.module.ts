import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SamplesRepository } from '@/domain/lab/application/repositories/samples-repository';
import { SampleStatusHistoryRepository } from '@/domain/lab/application/repositories/sample-status-history-repository';
import { PrismaSamplesRepository } from './repositories/prisma-samples-repository';
import { PrismaSampleStatusHistoryRepository } from './repositories/prisma-sample-status-history-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: SamplesRepository,
      useClass: PrismaSamplesRepository,
    },
    {
      provide: SampleStatusHistoryRepository,
      useClass: PrismaSampleStatusHistoryRepository,
    },
  ],
  exports: [PrismaService, SamplesRepository, SampleStatusHistoryRepository],
})
export class DatabaseModule {}
