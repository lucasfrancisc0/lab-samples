import { SampleStatusHistory } from '@/domain/lab/enterprise/entities/sample-status-history';

export class SampleStatusHistoryPresenter {
  static toHTTP(item: SampleStatusHistory) {
    return {
      id: item.id.toString(),
      sampleId: item.sampleId.toString(),
      fromStatus: item.fromStatus,
      toStatus: item.toStatus,
      changedAt: item.changedAt,
    };
  }
}
