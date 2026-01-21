export class SampleAlreadyExistsError extends Error {
  constructor(code: string) {
    super(`Sample with code "${code}" already exists.`);
  }
}
