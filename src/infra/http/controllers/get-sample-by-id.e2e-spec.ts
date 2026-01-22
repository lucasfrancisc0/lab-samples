import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

type GetSampleByIdResponseBody = {
  sample: {
    id: string;
    code: string;
    analysisType: string;
    collectedAt: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

describe('Get sample by id (E2E)', () => {
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

  test('[GET] /samples/:id should return sample', async () => {
    const sample = await prisma.sample.create({
      data: {
        code: 'G-001',
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      },
    });

    const response = await request(app.getHttpServer()).get(
      `/samples/${sample.id}`,
    );

    expect(response.statusCode).toBe(200);

    const body = response.body as GetSampleByIdResponseBody;
    expect(body).toHaveProperty('sample');
    expect(body.sample.code).toBe('G-001');
  });

  test('[GET] /samples/:id should return 404 when not found', async () => {
    const response = await request(app.getHttpServer()).get(
      '/samples/00000000-0000-0000-0000-000000000000',
    );

    expect(response.statusCode).toBe(404);
  });
});
