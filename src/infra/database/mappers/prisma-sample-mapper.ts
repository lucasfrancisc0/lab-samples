import {
  Sample as PrismaSample,
  SampleStatus as PrismaSampleStatus,
} from 'generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Sample } from '@/domain/lab/enterprise/entities/sample';
import {
  toDomainSampleStatus,
  toPrismaSampleStatus,
} from './prisma-sample-status-mapper';

export class PrismaSampleMapper {
  static toDomain(raw: PrismaSample): Sample {
    const sampleOrError = Sample.create(
      {
        code: raw.code,
        analysisType: raw.analysisType,
        collectedAt: raw.collectedAt,
        status: toDomainSampleStatus(raw.status),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );

    if (sampleOrError.isLeft()) {
      throw new Error(
        `Invalid sample persisted: ${sampleOrError.value.message}`,
      );
    }

    return sampleOrError.value;
  }

  static toPrisma(sample: Sample) {
    return {
      id: sample.id.toString(),
      code: sample.code,
      analysisType: sample.analysisType,
      collectedAt: sample.collectedAt,
      status: toPrismaSampleStatus(sample.status),
      createdAt: sample.createdAt,
      updatedAt: sample.updatedAt,
    };
  }
}
