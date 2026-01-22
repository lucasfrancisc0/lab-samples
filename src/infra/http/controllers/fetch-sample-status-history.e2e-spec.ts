import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

type FetchHistoryResponseBody = {
  items: Array<{
    id: string;
    sampleId: string;
    fromStatus: string;
    toStatus: string;
    changedAt: string;
  }>;
};

describe('Fetch sample status history (E2E)', () => {
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

  test('[GET] /samples/:id/history should list history', async () => {
    const sample = await prisma.sample.create({
      data: {
        code: 'H-001',
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      },
    });

    await prisma.sampleStatusHistory.createMany({
      data: [
        {
          sampleId: sample.id,
          fromStatus: 'PENDENTE',
          toStatus: 'EM_ANALISE',
          changedAt: new Date('2025-01-02T10:00:00.000Z'),
        },
        {
          sampleId: sample.id,
          fromStatus: 'EM_ANALISE',
          toStatus: 'CONCLUIDA',
          changedAt: new Date('2025-01-03T10:00:00.000Z'),
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get(`/samples/${sample.id}/history`)
      .query({ page: 1 });

    expect(response.statusCode).toBe(200);

    const body = response.body as FetchHistoryResponseBody;
    expect(body.items.length).toBeGreaterThanOrEqual(2);

    expect(body.items[0]).toEqual(
      expect.objectContaining({
        fromStatus: 'EM_ANALISE',
        toStatus: 'CONCLUIDA',
      }),
    );
  });
});
