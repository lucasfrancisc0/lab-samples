import {
  FindManySamplesFilters,
  FindManySamplesResult,
  SamplesRepository,
  SampleSortBy,
  SortDir,
} from '@/domain/lab/application/repositories/samples-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { toPrismaSampleStatus } from '../mappers/prisma-sample-status-mapper';
import { Sample } from '@/domain/lab/enterprise/entities/sample';
import { PrismaSampleMapper } from '../mappers/prisma-sample-mapper';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { Inject } from '@nestjs/common';

export class PrismaSamplesRepository implements SamplesRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  async findById(id: string): Promise<Sample | null> {
    const sample = await this.prisma.sample.findUnique({
      where: { id },
    });

    if (!sample) return null;
    return PrismaSampleMapper.toDomain(sample);
  }

  async findByCode(code: string): Promise<Sample | null> {
    const sample = await this.prisma.sample.findUnique({
      where: { code },
    });

    if (!sample) return null;
    return PrismaSampleMapper.toDomain(sample);
  }

  async findMany(
    filters: FindManySamplesFilters,
    params: PaginationParams,
    sort?: { by: SampleSortBy; dir: SortDir },
  ): Promise<FindManySamplesResult> {
    const perPage = 20;
    const page = params.page;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: Prisma.SampleWhereInput = {};

    if (filters.code) where.code = filters.code;
    if (filters.analysisType) where.analysisType = filters.analysisType;

    if (filters.status) {
      where.status = toPrismaSampleStatus(filters.status);
    }

    if (filters.collectedFrom || filters.collectedTo) {
      where.collectedAt = {};

      if (filters.collectedFrom) {
        where.collectedAt.gte = filters.collectedFrom;
      }

      if (filters.collectedTo) {
        where.collectedAt.lte = filters.collectedTo;
      }
    }

    const by: SampleSortBy = sort?.by ?? 'collectedAt';
    const dir: SortDir = sort?.dir ?? 'desc';

    const orderBy =
      by === 'code'
        ? { code: dir }
        : by === 'status'
          ? { status: dir }
          : { collectedAt: dir };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.sample.count({ where }),
      this.prisma.sample.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    return {
      items: items.map((item) => PrismaSampleMapper.toDomain(item)),
      total,
    };
  }

  async create(sample: Sample): Promise<void> {
    const data = PrismaSampleMapper.toPrisma(sample);

    await this.prisma.sample.create({
      data,
    });
  }

  async save(sample: Sample): Promise<void> {
    const data = PrismaSampleMapper.toPrisma(sample);

    await this.prisma.sample.update({
      where: { id: data.id },
      data: {
        code: data.code,
        analysisType: data.analysisType,
        collectedAt: data.collectedAt,
        status: data.status,
      },
    });
  }
}
