import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ChangeSampleStatusDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Alterar o status de uma amostra' }),

    ApiParam({
      name: 'id',
      description: 'ID da amostra',
      example: '08ae166c-8f1e-42da-87df-becab18a2292',
      required: true,
    }),

    ApiBody({
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'APROVADA',
            enum: [
              'PENDENTE',
              'EM_ANALISE',
              'CONCLUIDA',
              'APROVADA',
              'REJEITADA',
            ],
          },
        },
        required: ['status'],
      },
    }),

    ApiResponse({
      status: 200,
      description: 'Status atualizado com sucesso',
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
              collectedAt: { type: 'string', format: 'date-time' },
              status: {
                type: 'string',
                example: 'APROVADA',
                enum: [
                  'PENDENTE',
                  'EM_ANALISE',
                  'CONCLUIDA',
                  'APROVADA',
                  'REJEITADA',
                ],
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    }),

    ApiResponse({ status: 404, description: 'Amostra não encontrada' }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
  );
}
