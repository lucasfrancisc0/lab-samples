import { Either, left, right } from '@/core/either';

import { SamplesRepository } from '../repositories/samples-repository';
import { SampleAlreadyExistsError } from '../errors/sample-already-exists.error';
import { InvalidCollectedAtError } from '../errors/invalid-collected-at.error';
import { Sample } from '../../enterprise/entities/sample';
import { Inject } from '@nestjs/common';

interface CreateSampleUseCaseRequest {
  code: string;
  analysisType: string;
  collectedAt: Date;
}

type CreateSampleUseCaseResponse = Either<
  SampleAlreadyExistsError | InvalidCollectedAtError,
  {
    sample: Sample;
  }
>;

export class CreateSampleUseCase {
  constructor(
    @Inject(SamplesRepository)
    private samplesRepository: SamplesRepository
  ) {}

  async execute({
    code,
    analysisType,
    collectedAt,
  }: CreateSampleUseCaseRequest): Promise<CreateSampleUseCaseResponse> {
    const existingSample = await this.samplesRepository.findByCode(code);

    if (existingSample) {
      return left(new SampleAlreadyExistsError(code));
    }

    const sampleOrError = Sample.create({
      code,
      analysisType,
      collectedAt,
    });

    if (sampleOrError.isLeft()) {
      return left(sampleOrError.value);
    }

    const sample = sampleOrError.value;

    await this.samplesRepository.create(sample);

    return right({
      sample,
    });
  }
}
