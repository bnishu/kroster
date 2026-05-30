import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const adapter = new PrismaMariaDb({ 
  host: process.env.DB_HOST ?? 'localhost', 
  port: Number(process.env.DB_PORT ?? 3306), 
  user: process.env.DB_USER ?? 'root', 
  password: process.env.DB_PASS ?? '', 
  database: process.env.DB_NAME ?? 'kroster' 
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const dataPath = path.join(__dirname, 'recovered_members.json');
  if (!fs.existsSync(dataPath)) {
    console.error('No recovered_members.json found.');
    return;
  }
  
  const members = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let count = 0;
  
  for (const member of members) {
    if (!member.slug) continue;
    
    // Find if the member exists in db
    const dbMember = await prisma.member.findUnique({
      where: { slug: member.slug }
    });
    
    if (dbMember) {
      await prisma.member.update({
        where: { slug: member.slug },
        data: {
          email: member.email || dbMember.email,
          teamRole: member.teamRole || dbMember.teamRole,
          profileImage: member.profileImage || dbMember.profileImage,
          fullName: member.fullName || dbMember.fullName,
        }
      });
      count++;
      console.log(`Updated ${member.slug}`);
    } else {
      console.log(`Skipped ${member.slug} (not found in DB)`);
    }
  }
  
  console.log(`Successfully updated ${count} members from recovery data.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
