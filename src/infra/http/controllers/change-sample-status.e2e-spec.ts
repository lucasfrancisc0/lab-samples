import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

type ChangeStatusResponseBody = {
  sampleId: string;
  status: string;
};

type FetchHistoryResponseBody = {
  items: Array<{
    fromStatus: string;
    toStatus: string;
    changedAt: string;
  }>;
};

describe('Change sample status (E2E)', () => {
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

  test('[PATCH] /samples/:id/status should change status and create history', async () => {
    const sample = await prisma.sample.create({
      data: {
        code: 'C-001',
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      },
    });

    const patch = await request(app.getHttpServer())
      .patch(`/samples/${sample.id}/status`)
      .send({ toStatus: 'EM_ANALISE' });

    expect(patch.statusCode).toBe(200);

    const patchBody = patch.body as ChangeStatusResponseBody;
    expect(patchBody).toEqual({
      sampleId: sample.id,
      status: 'EM_ANALISE',
    });

    const history = await request(app.getHttpServer())
      .get(`/samples/${sample.id}/history`)
      .query({ page: 1 });

    expect(history.statusCode).toBe(200);

    const historyBody = history.body as FetchHistoryResponseBody;
    expect(historyBody.items.length).toBeGreaterThanOrEqual(1);

    expect(historyBody.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fromStatus: 'PENDENTE',
          toStatus: 'EM_ANALISE',
        }),
      ]),
    );
  });

  test('[PATCH] /samples/:id/status should register history for multiple transitions', async () => {
    const sample = await prisma.sample.create({
      data: {
        code: 'CS-HIST-2',
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      },
    });

    const r1 = await request(app.getHttpServer())
      .patch(`/samples/${sample.id}/status`)
      .send({ toStatus: 'EM_ANALISE' });

    expect(r1.statusCode).toBe(200);

    const r2 = await request(app.getHttpServer())
      .patch(`/samples/${sample.id}/status`)
      .send({ toStatus: 'CONCLUIDA' });

    expect(r2.statusCode).toBe(200);

    const historyOnDb = await prisma.sampleStatusHistory.findMany({
      where: { sampleId: sample.id },
      orderBy: { changedAt: 'asc' },
    });

    expect(historyOnDb).toHaveLength(2);

    expect(historyOnDb[0].fromStatus).toBe('PENDENTE');
    expect(historyOnDb[0].toStatus).toBe('EM_ANALISE');

    expect(historyOnDb[1].fromStatus).toBe('EM_ANALISE');
    expect(historyOnDb[1].toStatus).toBe('CONCLUIDA');

    const sampleOnDb = await prisma.sample.findUnique({
      where: { id: sample.id },
    });

    expect(sampleOnDb?.status).toBe('CONCLUIDA');
  });

  test('[PATCH] /samples/:id/status should return 404 when sample not found', async () => {
    const response = await request(app.getHttpServer())
      .patch('/samples/00000000-0000-0000-0000-000000000000/status')
      .send({ toStatus: 'EM_ANALISE' });

    expect(response.statusCode).toBe(404);
  });

  test('[PATCH] /samples/:id/status should return 422 when trying to revert status (backwards)', async () => {
    const sample = await prisma.sample.create({
      data: {
        code: 'CS-BACK',
        analysisType: 'Blood',
        collectedAt: new Date('2025-01-01T10:00:00.000Z'),
        status: 'PENDENTE',
      },
    });

    await request(app.getHttpServer())
      .patch(`/samples/${sample.id}/status`)
      .send({ toStatus: 'EM_ANALISE' });

    await request(app.getHttpServer())
      .patch(`/samples/${sample.id}/status`)
      .send({ toStatus: 'CONCLUIDA' });

    const response = await request(app.getHttpServer())
      .patch(`/samples/${sample.id}/status`)
      .send({ toStatus: 'EM_ANALISE' });

    expect(response.statusCode).toBe(422);
  });
});
