import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

type CreateSampleResponseBody = {
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

describe('Create sample (E2E)', () => {
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

  test('[POST] /samples', async () => {
    const response = await request(app.getHttpServer()).post('/samples').send({
      code: 'S-001',
      analysisType: 'Blood',
      collectedAt: '2025-01-01T10:00:00.000Z',
    });

    expect(response.statusCode).toBe(201);

    const body = response.body as CreateSampleResponseBody;
    expect(body).toHaveProperty('sample');
    expect(body.sample.code).toBe('S-001');

    const sampleOnDb = await prisma.sample.findUnique({
      where: { code: 'S-001' },
    });

    expect(sampleOnDb).toBeTruthy();
    expect(sampleOnDb?.status).toBe('PENDENTE');
  });

  test('[POST] /samples should return 409 when code already exists', async () => {
    await prisma.sample.create({
      data: {
        code: 'S-409',
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      },
    });

    const response = await request(app.getHttpServer()).post('/samples').send({
      code: 'S-409',
      analysisType: 'Blood',
      collectedAt: '2025-01-01T10:00:00.000Z',
    });

    expect(response.statusCode).toBe(409);
  });

  test('[POST] /samples should return 400 when collectedAt is in the future', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60).toISOString();

    const response = await request(app.getHttpServer()).post('/samples').send({
      code: 'S-FUTURE',
      analysisType: 'Blood',
      collectedAt: future,
    });

    expect(response.statusCode).toBe(400);
  });
});
