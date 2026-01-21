import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { SampleStatus } from '../value-objects/sample-status';

export interface SampleStatusHistoryProps {
  sampleId: UniqueEntityID;
  fromStatus: SampleStatus;
  toStatus: SampleStatus;
  changedAt: Date;
}

export class SampleStatusHistory extends Entity<SampleStatusHistoryProps> {
  get sampleId() {
    return this.props.sampleId;
  }

  get fromStatus() {
    return this.props.fromStatus;
  }

  get toStatus() {
    return this.props.toStatus;
  }

  get changedAt() {
    return this.props.changedAt;
  }

  static create(
    props: Optional<SampleStatusHistoryProps, 'changedAt'>,
    id?: UniqueEntityID,
  ) {
    const history = new SampleStatusHistory(
      {
        ...props,
        changedAt: props.changedAt ?? new Date(),
      },
      id,
    );

    return history;
  }
}
