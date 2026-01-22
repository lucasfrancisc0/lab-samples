import { Sample } from '@/domain/lab/enterprise/entities/sample';

export class SamplePresenter {
  static toHTTP(sample: Sample) {
    return {
      id: sample.id.toString(),
      code: sample.code,
      analysisType: sample.analysisType,
      collectedAt: sample.collectedAt,
      status: sample.status,
      createdAt: sample.createdAt,
      updatedAt: sample.updatedAt,
    };
  }
}
