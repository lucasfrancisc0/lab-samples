import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySamplesRepository } from '../../../../../test/repositories/in-memory-samples-repository';
import { InMemorySampleStatusHistoryRepository } from '../../../../../test/repositories/in-memory-sample-status-history-repository';

import { CreateSampleUseCase } from './create-sample';
import { ChangeSampleStatusUseCase } from './change-sample-status';

import { SampleStatus } from '../../enterprise/value-objects/sample-status';
import { SampleNotFoundError } from '../errors/sample-not-found.error';
import { InvalidStatusTransitionError } from '../errors/invalid-status-transition.error';

let samplesRepository: InMemorySamplesRepository;
let historyRepository: InMemorySampleStatusHistoryRepository;

let createSample: CreateSampleUseCase;
let sut: ChangeSampleStatusUseCase;

describe('ChangeSampleStatusUseCase', () => {
  beforeEach(() => {
    samplesRepository = new InMemorySamplesRepository();
    historyRepository = new InMemorySampleStatusHistoryRepository();

    createSample = new CreateSampleUseCase(samplesRepository);
    sut = new ChangeSampleStatusUseCase(samplesRepository, historyRepository);
  });

  it('should change status and register history', async () => {
    const created = await createSample.execute({
      code: 'A-100',
      analysisType: 'Blood',
      collectedAt: new Date(),
    });

    if (created.isLeft()) {
      throw new Error('Sample should have been created');
    }

    const sample = created.value.sample;

    const result = await sut.execute({
      sampleId: sample.id.toString(),
      toStatus: SampleStatus.EM_ANALISE,
    });

    expect(result.isRight()).toBe(true);
    expect(samplesRepository.items[0].status).toBe(SampleStatus.EM_ANALISE);

    expect(historyRepository.items).toHaveLength(1);
    expect(historyRepository.items[0].fromStatus).toBe(SampleStatus.PENDENTE);
    expect(historyRepository.items[0].toStatus).toBe(SampleStatus.EM_ANALISE);
  });

  it('should not allow invalid status transition', async () => {
    const created = await createSample.execute({
      code: 'A-100',
      analysisType: 'Blood',
      collectedAt: new Date(),
    });

    if (created.isLeft()) {
      throw new Error('Sample should have been created');
    }

    const sample = created.value.sample;

    const result = await sut.execute({
      sampleId: sample.id.toString(),
      toStatus: SampleStatus.CONCLUIDA,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError);
  });

  it('should return error when sample does not exist', async () => {
    const result = await sut.execute({
      sampleId: 'invalid-id',
      toStatus: SampleStatus.EM_ANALISE,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SampleNotFoundError);
  });
});
