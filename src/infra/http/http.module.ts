import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { CreateSampleUseCase } from '@/domain/lab/application/use-cases/create-sample';
import { FetchSamplesUseCase } from '@/domain/lab/application/use-cases/fetch-samples';
import { GetSampleByIdUseCase } from '@/domain/lab/application/use-cases/get-sample-by-id';
import { ChangeSampleStatusUseCase } from '@/domain/lab/application/use-cases/change-sample-status';
import { FetchSampleStatusHistoryUseCase } from '@/domain/lab/application/use-cases/fetch-sample-status-history';

import { CreateSampleController } from './controllers/create-sample.controller';
import { FetchSamplesController } from './controllers/fetch-samples.controller';
import { GetSampleByIdController } from './controllers/get-sample-by-id.controller';
import { ChangeSampleStatusController } from './controllers/change-sample-status.controller';
import { FetchSampleStatusHistoryController } from './controllers/fetch-sample-status-history.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateSampleController,
    FetchSamplesController,
    GetSampleByIdController,
    ChangeSampleStatusController,
    FetchSampleStatusHistoryController,
  ],
  providers: [
    CreateSampleUseCase,
    FetchSamplesUseCase,
    GetSampleByIdUseCase,
    ChangeSampleStatusUseCase,
    FetchSampleStatusHistoryUseCase,
  ],
})
export class HttpModule {}
