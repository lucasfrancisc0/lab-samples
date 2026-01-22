import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

type FetchSamplesResponseBody = {
  total: number;
  items: Array<{
    id: string;
    code: string;
    analysisType: string;
    collectedAt: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

describe('Fetch samples (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[GET] /samples should list with pagination', async () => {
    await prisma.sample.createMany({
      data: Array.from({ length: 25 }).map((_, i) => ({
        code: `P-${String(i + 1).padStart(3, '0')}`,
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      })),
    });

    const response = await request(app.getHttpServer())
      .get('/samples')
      .query({ page: 2, sortBy: 'code', sortDir: 'asc' });

    expect(response.statusCode).toBe(200);

    const body = response.body as FetchSamplesResponseBody;
    expect(body.total).toBe(25);
    expect(body.items).toHaveLength(5);
  });

  test('[GET] /samples should filter by status', async () => {
    await prisma.sample.createMany({
      data: [
        {
          code: 'F-001',
          analysisType: 'Blood',
          collectedAt: new Date('2025-01-01T10:00:00.000Z'),
          status: 'PENDENTE',
        },
        {
          code: 'F-002',
          analysisType: 'Blood',
          collectedAt: new Date('2025-01-01T10:00:00.000Z'),
          status: 'EM_ANALISE',
        },
      ],
    });

    const response = await request(app.getHttpServer()).get('/samples').query({
      page: 1,
      status: 'EM_ANALISE',
      sortBy: 'code',
      sortDir: 'asc',
    });

    expect(response.statusCode).toBe(200);

    const body = response.body as FetchSamplesResponseBody;
    expect(body.items).toHaveLength(1);
    expect(body.items[0].code).toBe('F-002');
  });
});
