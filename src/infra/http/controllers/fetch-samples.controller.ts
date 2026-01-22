import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { FetchSamplesUseCase } from '@/domain/lab/application/use-cases/fetch-samples';
import { SamplePresenter } from '../presenters/sample-presenter';
import { SampleStatus } from '@/domain/lab/enterprise/value-objects/sample-status';
import {
  SampleSortBy,
  SortDir,
} from '@/domain/lab/application/repositories/samples-repository';

const fetchSamplesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  code: z.string().optional(),
  analysisType: z.string().optional(),

  status: z.nativeEnum(SampleStatus).optional(),

  collectedFrom: z.string().datetime().optional(),
  collectedTo: z.string().datetime().optional(),

  sortBy: z.enum(['collectedAt', 'code', 'status']).optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

const queryValidationPipe = new ZodValidationPipe(fetchSamplesQuerySchema);
type FetchSamplesQuery = z.infer<typeof fetchSamplesQuerySchema>;

@Controller('/samples')
export class FetchSamplesController {
  constructor(private fetchSamples: FetchSamplesUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchSamplesQuery) {
    const collectedFrom = query.collectedFrom
      ? new Date(query.collectedFrom)
      : undefined;
    const collectedTo = query.collectedTo
      ? new Date(query.collectedTo)
      : undefined;

    const result = await this.fetchSamples.execute({
      filters: {
        code: query.code,
        analysisType: query.analysisType,
        status: query.status,
        collectedFrom,
        collectedTo,
      },
      pagination: { page: query.page },
      sort: query.sortBy
        ? {
            by: query.sortBy as SampleSortBy,
            dir: (query.sortDir ?? 'desc') as SortDir,
          }
        : undefined,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      total: result.value.result.total,
      items: result.value.result.items.map((item) =>
        SamplePresenter.toHTTP(item),
      ),
    };
  }
}
