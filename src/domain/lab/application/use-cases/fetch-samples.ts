import { Either, right } from '@/core/either';
import { PaginationParams } from '@/core/repositories/pagination-params';

import {
  FindManySamplesFilters,
  FindManySamplesResult,
  SamplesRepository,
  SampleSortBy,
  SortDir,
} from '../repositories/samples-repository';

interface FetchSamplesUseCaseRequest {
  filters?: FindManySamplesFilters;
  pagination: PaginationParams;
  sort?: {
    by: SampleSortBy;
    dir: SortDir;
  };
}

type FetchSamplesUseCaseResponse = Either<
  null,
  {
    result: FindManySamplesResult;
  }
>;

export class FetchSamplesUseCase {
  constructor(private samplesRepository: SamplesRepository) {}

  async execute({
    filters,
    pagination,
    sort,
  }: FetchSamplesUseCaseRequest): Promise<FetchSamplesUseCaseResponse> {
    const result = await this.samplesRepository.findMany(
      filters ?? {},
      pagination,
      sort,
    );

    return right({
      result,
    });
  }
}
