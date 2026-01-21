import { describe, expect, it, beforeEach } from 'vitest';

import { CreateSampleUseCase } from './create-sample';
import { InMemorySamplesRepository } from '../../../../../test/repositories/in-memory-samples-repository';
import { SampleAlreadyExistsError } from '../errors/sample-already-exists.error';
import { InvalidCollectedAtError } from '../errors/invalid-collected-at.error';

let samplesRepository: InMemorySamplesRepository;
let sut: CreateSampleUseCase;

describe('CreateSampleUseCase', () => {
  beforeEach(() => {
    samplesRepository = new InMemorySamplesRepository();
    sut = new CreateSampleUseCase(samplesRepository);
  });

  it('should create a sample', async () => {
    const result = await sut.execute({
      code: 'A-001',
      analysisType: 'Blood',
      collectedAt: new Date(),
    });

    expect(result.isRight()).toBe(true);
    expect(samplesRepository.items).toHaveLength(1);
    expect(samplesRepository.items[0].code).toBe('A-001');
  });

  it('should not allow creating samples with duplicated code', async () => {
    await sut.execute({
      code: 'A-001',
      analysisType: 'Blood',
      collectedAt: new Date(),
    });

    const result = await sut.execute({
      code: 'A-001',
      analysisType: 'Urine',
      collectedAt: new Date(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SampleAlreadyExistsError);
  });

  it('should not allow creating a sample with collectedAt in the future', async () => {
    const future = new Date();
    future.setMinutes(future.getMinutes() + 10);

    const result = await sut.execute({
      code: 'A-002',
      analysisType: 'Blood',
      collectedAt: future,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCollectedAtError);
  });
});
