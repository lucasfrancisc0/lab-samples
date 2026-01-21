import { PaginationParams } from '@/core/repositories/pagination-params';
import { Sample } from '../../enterprise/entities/sample';
import { SampleStatus } from '../../enterprise/value-objects/sample-status';

export type SampleSortBy = 'collectedAt' | 'code' | 'status';
export type SortDir = 'asc' | 'desc';

export interface FindManySamplesFilters {
  code?: string;
  analysisType?: string;
  status?: SampleStatus;
  collectedFrom?: Date;
  collectedTo?: Date;
}

export interface FindManySamplesResult {
  items: Sample[];
  total: number;
}

export interface SamplesRepository {
  findById(id: string): Promise<Sample | null>;
  findByCode(code: string): Promise<Sample | null>;

  findMany(
    filters: FindManySamplesFilters,
    params: PaginationParams,
    sort?: { by: SampleSortBy; dir: SortDir },
  ): Promise<FindManySamplesResult>;

  create(sample: Sample): Promise<void>;
  save(sample: Sample): Promise<void>;
}
