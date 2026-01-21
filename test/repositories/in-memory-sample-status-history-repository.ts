import { PaginationParams } from '@/core/repositories/pagination-params'
import { SampleStatusHistoryRepository } from '@/domain/lab/application/repositories/sample-status-history-repository'
import { SampleStatusHistory } from '@/domain/lab/enterprise/entities/sample-status-history'

export class InMemorySampleStatusHistoryRepository implements SampleStatusHistoryRepository {
  public items: SampleStatusHistory[] = []

  async create(history: SampleStatusHistory): Promise<void> {
    this.items.push(history)
  }

  async findManyBySampleId(
    sampleId: string,
    params: PaginationParams,
  ): Promise<SampleStatusHistory[]> {
    const data = this.items
      .filter((item) => item.sampleId.toString() === sampleId)
      .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime())

    const perPage = 20
    const start = (params.page - 1) * perPage
    const end = start + perPage

    return data.slice(start, end)
  }
}
