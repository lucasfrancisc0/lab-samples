import { SampleStatus } from '../value-objects/sample-status';
import { InvalidStatusTransitionError } from '../../application/errors/invalid-status-transition.error';

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

export function ensureValidStatusTransition(
  from: SampleStatus,
  to: SampleStatus,
): void {
  const allowed = transitions.get(from);

  if (!allowed?.has(to)) {
    throw new InvalidStatusTransitionError(from, to);
  }
}
