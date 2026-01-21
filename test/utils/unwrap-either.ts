import { Either, Left } from '@/core/either';

export function unwrapEither<L, R>(either: Either<L, R>): R {
  if (either instanceof Left) {
    throw new Error('Expected Right');
  }

  return either.value;
}
