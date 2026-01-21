import { PaginationParams } from '@/core/repositories/pagination-params';
import { SampleStatusHistory } from '../../enterprise/entities/sample-status-history';

export interface SampleStatusHistoryRepository {
  findManyBySampleId(
    sampleId: string,
    params: PaginationParams,
  ): Promise<SampleStatusHistory[]>;
  create(history: SampleStatusHistory): Promise<void>;
}