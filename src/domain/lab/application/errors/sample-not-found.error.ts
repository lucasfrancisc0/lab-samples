export class SampleNotFoundError extends Error {
  constructor(sampleId: string) {
    super(`Sample "${sampleId}" not found.`);
  }
}
