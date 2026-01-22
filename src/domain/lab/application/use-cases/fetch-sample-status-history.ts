import { Either, right } from '@/core/either';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { SampleStatusHistory } from '../../enterprise/entities/sample-status-history';
import { SampleStatusHistoryRepository } from '../repositories/sample-status-history-repository';
import { Inject } from '@nestjs/common';

interface FetchSampleStatusHistoryUseCaseRequest {
  sampleId: string;
  pagination: PaginationParams;
}

type FetchSampleStatusHistoryUseCaseResponse = Either<
  null,
  {
    history: SampleStatusHistory[];
  }
>;

export class FetchSampleStatusHistoryUseCase {
  constructor(
    @Inject(SampleStatusHistoryRepository)
    private historyRepository: SampleStatusHistoryRepository,
  ) {}

  async execute({
    sampleId,
    pagination,
  }: FetchSampleStatusHistoryUseCaseRequest): Promise<FetchSampleStatusHistoryUseCaseResponse> {
    const history = await this.historyRepository.findManyBySampleId(
      sampleId,
      pagination,
    );

    return right({
      history,
    });
  }
}
