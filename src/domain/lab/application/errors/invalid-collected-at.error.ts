export class InvalidCollectedAtError extends Error {
  constructor(collectedAt: Date) {
    super(
      `Invalid collectedAt date: ${collectedAt.toISOString()}. Collected date cannot be in the future.`,
    );
  }
}