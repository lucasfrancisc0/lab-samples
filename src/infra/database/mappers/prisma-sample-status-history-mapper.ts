import {
  SampleStatusHistory as PrismaHistory,
  SampleStatus as PrismaSampleStatus,
} from 'generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SampleStatusHistory } from '@/domain/lab/enterprise/entities/sample-status-history';
import { SampleStatus } from '@/domain/lab/enterprise/value-objects/sample-status';

export class PrismaSampleStatusHistoryMapper {
  static toDomain(raw: PrismaHistory): SampleStatusHistory {
    return SampleStatusHistory.create(
      {
        sampleId: new UniqueEntityID(raw.sampleId),
        fromStatus: raw.fromStatus as unknown as SampleStatus,
        toStatus: raw.toStatus as unknown as SampleStatus,
        changedAt: raw.changedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(history: SampleStatusHistory) {
    return {
      id: history.id.toString(),
      sampleId: history.sampleId.toString(),
      fromStatus: history.fromStatus as unknown as PrismaSampleStatus,
      toStatus: history.toStatus as unknown as PrismaSampleStatus,
      changedAt: history.changedAt,
    };
  }
}
