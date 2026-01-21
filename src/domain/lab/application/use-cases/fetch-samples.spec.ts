import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySamplesRepository } from '../../../../../test/repositories/in-memory-samples-repository';
import { unwrapEither } from '../../../../../test/utils/unwrap-either';

import { CreateSampleUseCase } from './create-sample';
import { FetchSamplesUseCase } from './fetch-samples';

import { SampleStatus } from '../../enterprise/value-objects/sample-status';

let samplesRepository: InMemorySamplesRepository;
let createSample: CreateSampleUseCase;
let sut: FetchSamplesUseCase;

describe('FetchSamplesUseCase', () => {
  beforeEach(() => {
    samplesRepository = new InMemorySamplesRepository();
    createSample = new CreateSampleUseCase(samplesRepository);
    sut = new FetchSamplesUseCase(samplesRepository);
  });

  it('should fetch samples with pagination', async () => {
    for (let i = 1; i <= 25; i++) {
      unwrapEither(
        await createSample.execute({
          code: `A-${String(i).padStart(3, '0')}`,
          analysisType: 'Blood',
          collectedAt: new Date(),
        }),
      );
    }

    const { result } = unwrapEither(
      await sut.execute({
        filters: {},
        pagination: { page: 2 },
        sort: { by: 'code', dir: 'asc' },
      }),
    );

    expect(result.items).toHaveLength(5);
    expect(result.total).toBe(25);
  });

  it('should filter by status', async () => {
    unwrapEither(
      await createSample.execute({
        code: 'S-001',
        analysisType: 'Blood',
        collectedAt: new Date(),
      }),
    );

    const created2 = unwrapEither(
      await createSample.execute({
        code: 'S-002',
        analysisType: 'Blood',
        collectedAt: new Date(),
      }),
    );

    const sample2 = created2.sample;
    unwrapEither(sample2.changeStatus(SampleStatus.EM_ANALISE));

    await samplesRepository.save(sample2);

    const { result } = unwrapEither(
      await sut.execute({
        filters: { status: SampleStatus.EM_ANALISE },
        pagination: { page: 1 },
        sort: { by: 'code', dir: 'asc' },
      }),
    );

    expect(result.total).toBe(1);
    expect(result.items[0].code).toBe('S-002');
  });

  it('should sort by collectedAt desc by default when sort is not provided', async () => {
    const d1 = new Date('2020-01-01T00:00:00.000Z');
    const d2 = new Date('2021-01-01T00:00:00.000Z');

    unwrapEither(
      await createSample.execute({
        code: 'D-001',
        analysisType: 'Blood',
        collectedAt: d1,
      }),
    );

    unwrapEither(
      await createSample.execute({
        code: 'D-002',
        analysisType: 'Blood',
        collectedAt: d2,
      }),
    );

    const { result } = unwrapEither(
      await sut.execute({
        filters: {},
        pagination: { page: 1 },
      }),
    );

    expect(result.items[0].code).toBe('D-002');
  });

  it('should filter by code', async () => {
    unwrapEither(
      await createSample.execute({
        code: 'C-001',
        analysisType: 'Blood',
        collectedAt: new Date(),
      }),
    );

    unwrapEither(
      await createSample.execute({
        code: 'C-002',
        analysisType: 'Blood',
        collectedAt: new Date(),
      }),
    );

    const { result } = unwrapEither(
      await sut.execute({
        filters: { code: 'C-002' },
        pagination: { page: 1 },
        sort: { by: 'code', dir: 'asc' },
      }),
    );

    expect(result.total).toBe(1);
    expect(result.items[0].code).toBe('C-002');
  });

  it('should filter by analysisType', async () => {
    unwrapEither(
      await createSample.execute({
        code: 'T-001',
        analysisType: 'Blood',
        collectedAt: new Date(),
      }),
    );

    unwrapEither(
      await createSample.execute({
        code: 'T-002',
        analysisType: 'Urine',
        collectedAt: new Date(),
      }),
    );

    const { result } = unwrapEither(
      await sut.execute({
        filters: { analysisType: 'Urine' },
        pagination: { page: 1 },
        sort: { by: 'code', dir: 'asc' },
      }),
    );

    expect(result.total).toBe(1);
    expect(result.items[0].code).toBe('T-002');
    expect(result.items[0].analysisType).toBe('Urine');
  });

  it('should filter by collected period', async () => {
    unwrapEither(
      await createSample.execute({
        code: 'P-001',
        analysisType: 'Blood',
        collectedAt: new Date('2020-01-10T00:00:00.000Z'),
      }),
    );

    unwrapEither(
      await createSample.execute({
        code: 'P-002',
        analysisType: 'Blood',
        collectedAt: new Date('2020-02-10T00:00:00.000Z'),
      }),
    );

    unwrapEither(
      await createSample.execute({
        code: 'P-003',
        analysisType: 'Blood',
        collectedAt: new Date('2020-03-10T00:00:00.000Z'),
      }),
    );

    const { result } = unwrapEither(
      await sut.execute({
        filters: {
          collectedFrom: new Date('2020-02-01T00:00:00.000Z'),
          collectedTo: new Date('2020-02-28T23:59:59.999Z'),
        },
        pagination: { page: 1 },
        sort: { by: 'collectedAt', dir: 'asc' },
      }),
    );

    expect(result.total).toBe(1);
    expect(result.items[0].code).toBe('P-002');
  });
});
