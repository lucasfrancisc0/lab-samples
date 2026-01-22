import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateSampleDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Criar uma amostra' }),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'S-004' },
          analysisType: { type: 'string', example: 'ANALISE AGUA' },
          collectedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-12-01T10:00:00.000Z',
          },
        },
        required: ['code', 'analysisType', 'collectedAt'],
      },
    }),

    ApiResponse({
      status: 201,
      description: 'Amostra criada',
      schema: {
        type: 'object',
        properties: {
          sample: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '08ae166c-8f1e-42da-87df-becab18a2292',
              },
              code: { type: 'string', example: 'S-004' },
              analysisType: { type: 'string', example: 'ANALISE AGUA' },
              collectedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-12-01T10:00:00.000Z',
              },
              status: {
                type: 'string',
                example: 'PENDENTE',
                enum: [
                  'PENDENTE',
                  'EM_ANALISE',
                  'CONCLUIDA',
                  'APROVADA',
                  'REJEITADA',
                ],
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-22T06:13:34.710Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-22T06:14:42.620Z',
              },
            },
          },
        },
      },
    }),

    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 409, description: 'Amostra já existe' }),
  );
}
