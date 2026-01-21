import { beforeEach, describe, expect, it } from 'vitest';
import { CreateSampleUseCase } from './create-sample';
import { GetSampleByIdUseCase } from './get-sample-by-id';
import { SampleNotFoundError } from '../errors/sample-not-found.error';
import { InMemorySamplesRepository } from 'test/repositories/in-memory-samples-repository';
import { unwrapEither } from 'test/utils/unwrap-either';

let samplesRepository: InMemorySamplesRepository;
let createSample: CreateSampleUseCase;
let sut: GetSampleByIdUseCase;

describe('GetSampleByIdUseCase', () => {
  beforeEach(() => {
    samplesRepository = new InMemorySamplesRepository();
    createSample = new CreateSampleUseCase(samplesRepository);
    sut = new GetSampleByIdUseCase(samplesRepository);
  });

  it('should get a sample by id', async () => {
    const created = unwrapEither(
      await createSample.execute({
        code: 'ID-001',
        analysisType: 'Blood',
        collectedAt: new Date(),
      }),
    );

    const result = unwrapEither(
      await sut.execute({
        sampleId: created.sample.id.toString(),
      }),
    );

    expect(result.sample.code).toBe('ID-001');
  });

  it('should return error when sample does not exist', async () => {
    const result = await sut.execute({
      sampleId: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SampleNotFoundError);
  });
});
