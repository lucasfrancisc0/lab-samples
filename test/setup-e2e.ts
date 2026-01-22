import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

let prismaAdmin: PrismaClient;

export const schemaId = `test_${randomUUID().replaceAll('-', '_')}`;

function withSchema(url: string, schema: string) {
  const u = new URL(url);
  u.searchParams.set('schema', schema);
  return u.toString();
}

beforeAll(async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL missing');

  process.env.DATABASE_SCHEMA = schemaId;

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: withSchema(databaseUrl, schemaId),
    },
  });

  const adminAdapter = new PrismaPg(
    { connectionString: databaseUrl },
    { schema: 'public' },
  );

  prismaAdmin = new PrismaClient({ adapter: adminAdapter });
  await prismaAdmin.$connect();
});

afterAll(async () => {
  if (!prismaAdmin) return;

  await prismaAdmin.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  );

  await prismaAdmin.$disconnect();
});
