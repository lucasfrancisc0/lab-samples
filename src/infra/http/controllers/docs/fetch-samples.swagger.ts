import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function FetchSamplesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar amostras com paginação e ordenação' }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Página (começa em 1)',
    }),

    ApiQuery({
      name: 'perPage',
      required: false,
      type: Number,
      example: 20,
      description: 'Quantidade por página',
    }),

    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      example: 'createdAt',
      description: 'Campo para ordenação',
      schema: {
        type: 'string',
        enum: ['createdAt', 'updatedAt', 'collectedAt'],
      },
    }),

    ApiQuery({
      name: 'sortDir',
      required: false,
      type: String,
      example: 'desc',
      description: 'Direção da ordenação',
      schema: {
        type: 'string',
        enum: ['asc', 'desc'],
      },
    }),

    ApiResponse({
      status: 200,
      description: 'Lista de amostras',
      schema: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 9 },
          items: {
            type: 'array',
            items: {
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
                  example: 'PENDENTE',
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
      },
    }),

    ApiResponse({ status: 400, description: 'Parâmetros inválidos' }),
  );
}
