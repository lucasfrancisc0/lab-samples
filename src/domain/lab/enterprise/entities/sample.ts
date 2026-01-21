import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Either, left, right } from '@/core/either';

import { SampleStatus } from '../value-objects/sample-status';
import { ensureValidStatusTransition } from '../rules/status-transition';
import { InvalidCollectedAtError } from '../../application/errors/invalid-collected-at.error';

export interface SampleProps {
  code: string;
  analysisType: string;
  collectedAt: Date;

  status: SampleStatus;

  createdAt: Date;
  updatedAt: Date;
}

export class Sample extends Entity<SampleProps> {
  get code() {
    return this.props.code;
  }

  get analysisType() {
    return this.props.analysisType;
  }

  get collectedAt() {
    return this.props.collectedAt;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  changeStatus(to: SampleStatus) {
    ensureValidStatusTransition(this.status, to);

    this.props.status = to;
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<SampleProps, 'status' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Either<InvalidCollectedAtError, Sample> {
    const now = new Date();

    if (props.collectedAt.getTime() > now.getTime()) {
      return left(new InvalidCollectedAtError(props.collectedAt));
    }

    const sample = new Sample(
      {
        ...props,
        status: props.status ?? SampleStatus.PENDENTE,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );

    return right(sample);
  }
}
