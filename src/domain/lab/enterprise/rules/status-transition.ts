import { SampleStatus } from '../value-objects/sample-status';

const transitions = new Map<SampleStatus, Set<SampleStatus>>([
  [SampleStatus.PENDENTE, new Set([SampleStatus.EM_ANALISE])],
  [SampleStatus.EM_ANALISE, new Set([SampleStatus.CONCLUIDA])],
  [
    SampleStatus.CONCLUIDA,
    new Set([SampleStatus.APROVADA, SampleStatus.REJEITADA]),
  ],
  [SampleStatus.APROVADA, new Set()],
  [SampleStatus.REJEITADA, new Set()],
]);

export function canChangeSampleStatus(
  from: SampleStatus,
  to: SampleStatus,
): boolean {
  return transitions.get(from)?.has(to) ?? false;
}
