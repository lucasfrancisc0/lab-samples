import { SampleStatusHistory } from '@/domain/lab/enterprise/entities/sample-status-history';

export class InMemorySampleStatusHistoryRepository {
  public items: SampleStatusHistory[] = [];

  async create(history: SampleStatusHistory): Promise<void> {
    this.items.push(history);
  }

  async findManyBySampleId(sampleId: string): Promise<SampleStatusHistory[]> {
    return this.items.filter((item) => item.sampleId.toString() === sampleId);
  }
}
