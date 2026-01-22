import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function FetchSampleStatusHistoryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar histórico de status de uma amostra' }),

    ApiParam({
      name: 'id',
      description: 'ID da amostra',
      example: '08ae166c-8f1e-42da-87df-becab18a2292',
      required: true,
    }),

    ApiResponse({
      status: 200,
      description: 'Histórico de mudanças de status',
      schema: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 3 },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'b6c91f8-51c5-42a0-8def-ac8c933c049a',
                },
                sampleId: {
                  type: 'string',
                  example: '08ae166c-8f1e-42da-87df-becab18a2292',
                },
                fromStatus: {
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
                toStatus: {
                  type: 'string',
                  example: 'EM_ANALISE',
                  enum: [
                    'PENDENTE',
                    'EM_ANALISE',
                    'CONCLUIDA',
                    'APROVADA',
                    'REJEITADA',
                  ],
                },
                changedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-01-22T06:14:42.620Z',
                },
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
