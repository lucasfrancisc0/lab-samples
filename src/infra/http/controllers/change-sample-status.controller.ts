import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Patch,
  UnprocessableEntityException,
  Body,
} from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ChangeSampleStatusUseCase } from '@/domain/lab/application/use-cases/change-sample-status';
import { SampleStatus } from '@/domain/lab/enterprise/value-objects/sample-status';
import { SampleNotFoundError } from '@/domain/lab/application/errors/sample-not-found.error';
import { InvalidStatusTransitionError } from '@/domain/lab/application/errors/invalid-status-transition.error';
import { ChangeSampleStatusDocs } from './docs/change-sample-status.swagger';

const changeStatusParamSchema = z.object({
  id: z.string().uuid(),
});
const changeStatusBodySchema = z.object({
  toStatus: z.nativeEnum(SampleStatus),
});

const paramValidationPipe = new ZodValidationPipe(changeStatusParamSchema);
const bodyValidationPipe = new ZodValidationPipe(changeStatusBodySchema);

type ChangeStatusParam = z.infer<typeof changeStatusParamSchema>;
type ChangeStatusBody = z.infer<typeof changeStatusBodySchema>;

@Controller('/samples/:id/status')
export class ChangeSampleStatusController {
  constructor(private changeStatus: ChangeSampleStatusUseCase) {}

  @Patch()
  @ChangeSampleStatusDocs()
  async handle(
    @Param(paramValidationPipe) params: ChangeStatusParam,
    @Body(bodyValidationPipe) body: ChangeStatusBody,
  ) {
    const result = await this.changeStatus.execute({
      sampleId: params.id,
      toStatus: body.toStatus,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof SampleNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidStatusTransitionError) {
        throw new UnprocessableEntityException(error.message);
      }

      throw new BadRequestException();
    }

    return result.value;
  }
}
