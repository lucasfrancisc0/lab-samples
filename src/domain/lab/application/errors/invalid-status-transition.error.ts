import { SampleStatus } from '../../enterprise/value-objects/sample-status';

export class InvalidStatusTransitionError extends Error {
  constructor(from: SampleStatus, to: SampleStatus) {
    super(`Invalid status transition: ${from} -> ${to}`);
  }
}
