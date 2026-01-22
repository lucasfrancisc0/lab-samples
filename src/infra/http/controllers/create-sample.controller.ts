import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CreateSampleUseCase } from '@/domain/lab/application/use-cases/create-sample';
import { SampleAlreadyExistsError } from '@/domain/lab/application/errors/sample-already-exists.error';
import { InvalidCollectedAtError } from '@/domain/lab/application/errors/invalid-collected-at.error';
import { SamplePresenter } from '../presenters/sample-presenter';
import { CreateSampleDocs } from './docs/create-sample.swagger';

const createSampleBodySchema = z.object({
  code: z.string().min(1),
  analysisType: z.string().min(1),
  collectedAt: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(createSampleBodySchema);
type CreateSampleBody = z.infer<typeof createSampleBodySchema>;

@Controller('/samples')
export class CreateSampleController {
  constructor(private createSample: CreateSampleUseCase) {}

  @Post()
  @CreateSampleDocs()
  async handle(@Body(bodyValidationPipe) body: CreateSampleBody) {
    const collectedAt = new Date(body.collectedAt);

    const result = await this.createSample.execute({
      code: body.code,
      analysisType: body.analysisType,
      collectedAt,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof SampleAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof InvalidCollectedAtError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException();
    }

    return { sample: SamplePresenter.toHTTP(result.value.sample) };
  }
}
