import { PaginationParams } from '@/core/repositories/pagination-params';
import { SampleStatusHistory } from '../../enterprise/entities/sample-status-history';

export abstract class SampleStatusHistoryRepository {
  abstract findManyBySampleId(
    sampleId: string,
    params: PaginationParams,
  ): Promise<SampleStatusHistory[]>;

  abstract create(history: SampleStatusHistory): Promise<void>;
}
