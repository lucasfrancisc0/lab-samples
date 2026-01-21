import { Either, left, right } from '@/core/either';
import { Sample } from '../../enterprise/entities/sample';
import { SamplesRepository } from '../repositories/samples-repository';
import { SampleAlreadyExistsError } from '../errors/sample-already-exists.error';
import { InvalidCollectedAtError } from '../errors/invalid-collected-at.error';

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
  constructor(private samplesRepository: SamplesRepository) {}

  async execute({
    code,
    analysisType,
    collectedAt,
  }: CreateSampleUseCaseRequest): Promise<CreateSampleUseCaseResponse> {
    const existingSample = await this.samplesRepository.findByCode(code);

    if (existingSample) {
      return left(new SampleAlreadyExistsError(code));
    }

    const now = new Date();

    if (collectedAt.getTime() > now.getTime()) {
      return left(new InvalidCollectedAtError(collectedAt));
    }

    const sample = Sample.create({
      code,
      analysisType,
      collectedAt,
    });

    await this.samplesRepository.create(sample);

    return right({
      sample,
    });
  }
}
