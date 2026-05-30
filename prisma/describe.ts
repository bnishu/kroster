import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
const adapter = new PrismaMariaDb({ host: process.env.DB_HOST ?? 'localhost', port: Number(process.env.DB_PORT ?? 3306), user: process.env.DB_USER ?? 'root', password: process.env.DB_PASSWORD ?? '', database: process.env.DB_NAME ?? 'kroster' });
const prisma = new PrismaClient({ adapter });
async function main() {
  const columns = await prisma.$queryRaw`DESCRIBE members`;
  console.log(columns);
}
main().finally(() => prisma.$disconnect());
