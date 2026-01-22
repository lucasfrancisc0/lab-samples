import { PaginationParams } from '@/core/repositories/pagination-params';
import { SampleStatusHistoryRepository } from '@/domain/lab/application/repositories/sample-status-history-repository';
import { SampleStatusHistory } from '@/domain/lab/enterprise/entities/sample-status-history';
import { PrismaSampleStatusHistoryMapper } from '../mappers/prisma-sample-status-history-mapper';
import { PrismaService } from '../prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaSampleStatusHistoryRepository implements SampleStatusHistoryRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  async create(history: SampleStatusHistory): Promise<void> {
    const data = PrismaSampleStatusHistoryMapper.toPrisma(history);

    await this.prisma.sampleStatusHistory.create({
      data,
    });
  }

  async findManyBySampleId(
    sampleId: string,
    params: PaginationParams,
  ): Promise<SampleStatusHistory[]> {
    const perPage = 20;
    const skip = (params.page - 1) * perPage;
    const take = perPage;

    const items = await this.prisma.sampleStatusHistory.findMany({
      where: { sampleId },
      orderBy: { changedAt: 'desc' },
      skip,
      take,
    });

    return items.map((item) => PrismaSampleStatusHistoryMapper.toDomain(item));
  }
}
