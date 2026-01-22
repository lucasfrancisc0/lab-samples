import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function GetSampleByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Buscar amostra por ID' }),

    ApiParam({
      name: 'id',
      description: 'ID da amostra',
      example: '08ae166c-8f1e-42da-87df-becab18a2292',
      required: true,
    }),

    ApiResponse({
      status: 200,
      description: 'Amostra encontrada',
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

    ApiResponse({ status: 404, description: 'Amostra não encontrada' }),
    ApiResponse({ status: 400, description: 'ID inválido' }),
  );
}
