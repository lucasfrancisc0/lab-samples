import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { FetchSampleStatusHistoryUseCase } from '@/domain/lab/application/use-cases/fetch-sample-status-history';
import { SampleStatusHistoryPresenter } from '../presenters/sample-status-history-presenter';

const fetchHistoryParamSchema = z.object({
  id: z.string().uuid(),
});

const fetchHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

const paramValidationPipe = new ZodValidationPipe(fetchHistoryParamSchema);
const queryValidationPipe = new ZodValidationPipe(fetchHistoryQuerySchema);

type FetchHistoryParam = z.infer<typeof fetchHistoryParamSchema>;
type FetchHistoryQuery = z.infer<typeof fetchHistoryQuerySchema>;

@Controller('/samples/:id/history')
export class FetchSampleStatusHistoryController {
  constructor(private fetchHistory: FetchSampleStatusHistoryUseCase) {}

  @Get()
  async handle(
    @Param(paramValidationPipe) params: FetchHistoryParam,
    @Query(queryValidationPipe) query: FetchHistoryQuery,
  ) {
    const result = await this.fetchHistory.execute({
      sampleId: params.id,
      pagination: { page: query.page },
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      items: result.value.history.map((item) =>
        SampleStatusHistoryPresenter.toHTTP(item),
      ),
    };
  }
}
