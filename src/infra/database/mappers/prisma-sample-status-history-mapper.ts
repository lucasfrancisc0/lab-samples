import { SampleStatusHistory as PrismaHistory } from 'generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SampleStatusHistory } from '@/domain/lab/enterprise/entities/sample-status-history';
import {
  toDomainSampleStatus,
  toPrismaSampleStatus,
} from './prisma-sample-status-mapper';

export class PrismaSampleStatusHistoryMapper {
  static toDomain(raw: PrismaHistory): SampleStatusHistory {
    return SampleStatusHistory.create(
      {
        sampleId: new UniqueEntityID(raw.sampleId),
        fromStatus: toDomainSampleStatus(raw.fromStatus),
        toStatus: toDomainSampleStatus(raw.toStatus),
        changedAt: raw.changedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(history: SampleStatusHistory) {
    return {
      id: history.id.toString(),
      sampleId: history.sampleId.toString(),
      fromStatus: toPrismaSampleStatus(history.fromStatus),
      toStatus: toPrismaSampleStatus(history.toStatus),
      changedAt: history.changedAt,
    };
  }
}
