import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { SamplesRepository } from '../repositories/samples-repository';
import { SampleStatus } from '../../enterprise/value-objects/sample-status';
import { SampleStatusHistory } from '../../enterprise/entities/sample-status-history';

import { SampleNotFoundError } from '../errors/sample-not-found.error';
import { InvalidStatusTransitionError } from '../errors/invalid-status-transition.error';

interface ChangeSampleStatusUseCaseRequest {
  sampleId: string;
  toStatus: SampleStatus;
}

type ChangeSampleStatusUseCaseResponse = Either<
  SampleNotFoundError | InvalidStatusTransitionError,
  {
    sampleId: string;
    status: SampleStatus;
  }
>;

export class ChangeSampleStatusUseCase {
  constructor(
    private samplesRepository: SamplesRepository,
    private historyRepository: {
      create(history: SampleStatusHistory): Promise<void>;
    },
  ) {}

  async execute({
    sampleId,
    toStatus,
  }: ChangeSampleStatusUseCaseRequest): Promise<ChangeSampleStatusUseCaseResponse> {
    const sample = await this.samplesRepository.findById(sampleId);

    if (!sample) {
      return left(new SampleNotFoundError(sampleId));
    }

    const fromStatus = sample.status;

    const changeResult = sample.changeStatus(toStatus);

    if (changeResult.isLeft()) {
      return left(changeResult.value);
    }

    await this.samplesRepository.save(sample);

    const history = SampleStatusHistory.create({
      sampleId: new UniqueEntityID(sampleId),
      fromStatus,
      toStatus,
    });

    await this.historyRepository.create(history);

    return right({
      sampleId,
      status: sample.status,
    });
  }
}
