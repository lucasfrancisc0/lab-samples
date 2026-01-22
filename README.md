# Lab Samples API

API REST para gerenciamento de amostras laboratoriais: cadastro, consulta com filtros, atualização de status com regras de transição e histórico.

## Stack

- Node.js + NestJS
- Prisma ORM
- PostgreSQL (Docker)
- Vitest (testes unitários e E2E)

---

## Como rodar (dev)

### 1) Subir o banco

```bash
docker compose up -d
```

### 2) Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:docker@localhost:5432/lab-db?schema=public"
DATABASE_SCHEMA=public
```

### 3) Instalar dependências

```bash
pnpm install
```

### 4) Rodar migrations

```bash
pnpm prisma migrate dev
```

### 5) Rodar a API

```bash
pnpm start:dev
```

A aplicação estará disponível em: `http://localhost:3333`

---

## Regras de negócio

- `code` deve ser **único** (não permite duplicado).
- `collectedAt` **não pode** ser uma data futura.
- Fluxo de status permitido:
  - `PENDENTE -> EM_ANALISE -> CONCLUIDA -> (APROVADA | REJEITADA)`
- Toda mudança de status gera um registro no **histórico**.

---

## Endpoints

### 1) Criar amostra

`POST /samples`

**Body**

```json
{
  "code": "LAB-0001",
  "analysisType": "ANALISE_AGUA",
  "collectedAt": "2026-01-21T10:00:00.000Z"
}
```

**Respostas**

- `201 Created`
- `409 Conflict` (código duplicado)
- `400 Bad Request` (payload inválido / data futura)

**cURL**

```bash
curl -X POST http://localhost:3333/samples \
  -H "Content-Type: application/json" \
  -d '{"code":"LAB-0001","analysisType":"ANALISE_AGUA","collectedAt":"2026-01-21T10:00:00.000Z"}'
```

---

### 2) Listar/consultar amostras (filtros, ordenação, paginação)

`GET /samples`

**Query params**

- `code` (string)
- `analysisType` (string)
- `status` (`PENDENTE | EM_ANALISE | CONCLUIDA | APROVADA | REJEITADA`)
- `collectedFrom` (datetime ISO)
- `collectedTo` (datetime ISO)
- `sortBy` (`collectedAt | code | status`)
- `sortDir` (`asc | desc`)
- `page` (number >= 1)

**Exemplo**

```bash
curl "http://localhost:3333/samples?status=PENDENTE&sortBy=collectedAt&sortDir=desc&page=1"
```

**Respostas**

- `200 OK`

---

### 3) Buscar amostra por id

`GET /samples/:id`

**Respostas**

- `200 OK`
- `404 Not Found`

**cURL**

```bash
curl "http://localhost:3333/samples/<id>"
```

---

### 4) Atualizar status da amostra

`PATCH /samples/:id/status`

**Body**

```json
{
  "toStatus": "EM_ANALISE"
}
```

**Respostas**

- `200 OK`
- `404 Not Found` (amostra não encontrada)
- `422 Unprocessable Entity` (transição inválida)

**cURL**

```bash
curl -X PATCH "http://localhost:3333/samples/<id>/status" \
  -H "Content-Type: application/json" \
  -d '{"toStatus":"EM_ANALISE"}'
```

---

### 5) Histórico de status

`GET /samples/:id/history`

**Query params**

- `page` (number >= 1)

**Respostas**

- `200 OK`
- `404 Not Found`

**cURL**

```bash
curl "http://localhost:3333/samples/<id>/history?page=1"
```

---

## Testes

### Unit tests

```bash
pnpm test
```

### E2E tests

```bash
pnpm test:e2e
```

---

## Códigos HTTP usados

- `400 Bad Request`: validação de entrada / data futura
- `404 Not Found`: recurso não encontrado
- `409 Conflict`: código da amostra duplicado
- `422 Unprocessable Entity`: transição de status inválida
