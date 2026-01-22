import { Either, left, right } from '@/core/either';

import { SamplesRepository } from '../repositories/samples-repository';
import { Sample } from '../../enterprise/entities/sample';
import { SampleNotFoundError } from '../errors/sample-not-found.error';
import { Inject } from '@nestjs/common';

interface GetSampleByIdUseCaseRequest {
  sampleId: string;
}

type GetSampleByIdUseCaseResponse = Either<
  SampleNotFoundError,
  {
    sample: Sample;
  }
>;

export class GetSampleByIdUseCase {
  constructor(
    @Inject(SamplesRepository)
    private samplesRepository: SamplesRepository,
  ) {}

  async execute({
    sampleId,
  }: GetSampleByIdUseCaseRequest): Promise<GetSampleByIdUseCaseResponse> {
    const sample = await this.samplesRepository.findById(sampleId);

    if (!sample) {
      return left(new SampleNotFoundError(sampleId));
    }

    return right({
      sample,
    });
  }
}
