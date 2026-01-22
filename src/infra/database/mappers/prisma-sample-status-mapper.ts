import { SampleStatus as PrismaSampleStatus } from 'generated/prisma/client';
import { SampleStatus } from '@/domain/lab/enterprise/value-objects/sample-status';

function assertNever(x: never): never {
  throw new Error(`Unexpected status value: ${String(x)}`);
}

export function toDomainSampleStatus(status: PrismaSampleStatus): SampleStatus {
  switch (status) {
    case 'PENDENTE':
      return SampleStatus.PENDENTE;
    case 'EM_ANALISE':
      return SampleStatus.EM_ANALISE;
    case 'CONCLUIDA':
      return SampleStatus.CONCLUIDA;
    case 'APROVADA':
      return SampleStatus.APROVADA;
    case 'REJEITADA':
      return SampleStatus.REJEITADA;
    default:
      return assertNever(status);
  }
}

const domainToPrisma: Record<SampleStatus, PrismaSampleStatus> = {
  [SampleStatus.PENDENTE]: 'PENDENTE',
  [SampleStatus.EM_ANALISE]: 'EM_ANALISE',
  [SampleStatus.CONCLUIDA]: 'CONCLUIDA',
  [SampleStatus.APROVADA]: 'APROVADA',
  [SampleStatus.REJEITADA]: 'REJEITADA',
};

export function toPrismaSampleStatus(status: SampleStatus): PrismaSampleStatus {
  const mapped = domainToPrisma[status];
  if (!mapped) throw new Error(`Unmapped SampleStatus: ${String(status)}`);
  return mapped;
}
