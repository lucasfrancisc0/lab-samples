import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { GetSampleByIdUseCase } from '@/domain/lab/application/use-cases/get-sample-by-id';
import { SampleNotFoundError } from '@/domain/lab/application/errors/sample-not-found.error';
import { SamplePresenter } from '../presenters/sample-presenter';
import { GetSampleByIdDocs } from './docs/get-sample-by-id.swagger';

const getSampleByIdParamSchema = z.object({
  id: z.string().uuid(),
});

const paramValidationPipe = new ZodValidationPipe(getSampleByIdParamSchema);
type GetSampleByIdParam = z.infer<typeof getSampleByIdParamSchema>;

@Controller('/samples/:id')
export class GetSampleByIdController {
  constructor(private getSampleById: GetSampleByIdUseCase) {}

  @Get()
  @GetSampleByIdDocs()
  async handle(@Param(paramValidationPipe) params: GetSampleByIdParam) {
    const result = await this.getSampleById.execute({ sampleId: params.id });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof SampleNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException();
    }

    return { sample: SamplePresenter.toHTTP(result.value.sample) };
  }
}
