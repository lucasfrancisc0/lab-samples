import { PaginationParams } from '@/core/repositories/pagination-params';
import {
  SamplesRepository,
  FindManySamplesFilters,
  SampleSortBy,
  SortDir,
  FindManySamplesResult,
} from '@/domain/lab/application/repositories/samples-repository';
import { Sample } from '@/domain/lab/enterprise/entities/sample';

export class InMemorySamplesRepository implements SamplesRepository {
  public items: Sample[] = [];

  async findById(id: string): Promise<Sample | null> {
    const sample = this.items.find((item) => item.id.toString() === id);
    return sample ?? null;
  }

  async findByCode(code: string): Promise<Sample | null> {
    const sample = this.items.find((item) => item.code === code);
    return sample ?? null;
  }

  async findMany(
    filters: FindManySamplesFilters,
    params: PaginationParams,
    sort?: { by: SampleSortBy; dir: SortDir },
  ): Promise<FindManySamplesResult> {
    let data = [...this.items];

    if (filters.code) {
      data = data.filter((s) => s.code === filters.code);
    }

    if (filters.analysisType) {
      data = data.filter((s) => s.analysisType === filters.analysisType);
    }

    if (filters.status) {
      data = data.filter((s) => s.status === filters.status);
    }

    if (filters.collectedFrom) {
      data = data.filter(
        (s) => s.collectedAt.getTime() >= filters.collectedFrom!.getTime(),
      );
    }

    if (filters.collectedTo) {
      data = data.filter(
        (s) => s.collectedAt.getTime() <= filters.collectedTo!.getTime(),
      );
    }

    const by: SampleSortBy = sort?.by ?? 'collectedAt';
    const dir: SortDir = sort?.dir ?? 'desc';

    data.sort((a, b) => {
      const av =
        by === 'code'
          ? a.code
          : by === 'status'
            ? a.status
            : a.collectedAt.getTime();

      const bv =
        by === 'code'
          ? b.code
          : by === 'status'
            ? b.status
            : b.collectedAt.getTime();

      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    const perPage = 20;
    const page = params.page;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const paged = data.slice(start, end);

    return {
      items: paged,
      total: data.length,
    };
  }

  async create(sample: Sample): Promise<void> {
    this.items.push(sample);
  }

  async save(sample: Sample): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(sample.id));
    if (index >= 0) {
      this.items[index] = sample;
    }
  }
}
