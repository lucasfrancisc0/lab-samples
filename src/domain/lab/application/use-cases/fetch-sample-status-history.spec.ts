import { beforeEach, describe, expect, it } from 'vitest';

import { unwrapEither } from '../../../../../test/utils/unwrap-either';
import { InMemorySampleStatusHistoryRepository } from '../../../../../test/repositories/in-memory-sample-status-history-repository';

import { FetchSampleStatusHistoryUseCase } from './fetch-sample-status-history';
import { SampleStatusHistory } from '../../enterprise/entities/sample-status-history';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SampleStatus } from '../../enterprise/value-objects/sample-status';

let historyRepository: InMemorySampleStatusHistoryRepository;
let sut: FetchSampleStatusHistoryUseCase;

describe('FetchSampleStatusHistoryUseCase', () => {
  beforeEach(() => {
    historyRepository = new InMemorySampleStatusHistoryRepository();
    sut = new FetchSampleStatusHistoryUseCase(historyRepository);
  });

  it('should fetch status history by sampleId with pagination', async () => {
    const sampleId = new UniqueEntityID();

    for (let i = 1; i <= 25; i++) {
      const from = i === 1 ? SampleStatus.PENDENTE : SampleStatus.EM_ANALISE;
      const to = SampleStatus.EM_ANALISE;

      const history = SampleStatusHistory.create({
        sampleId,
        fromStatus: from,
        toStatus: to,
        changedAt: new Date(2020, 0, i),
      });

      await historyRepository.create(history);
    }

    const { history } = unwrapEither(
      await sut.execute({
        sampleId: sampleId.toString(),
        pagination: { page: 2 },
      }),
    );

    expect(history).toHaveLength(5);
  });
});
