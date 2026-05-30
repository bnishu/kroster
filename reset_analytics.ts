import { prisma } from './src/lib/prisma'

async function main() {
  const result = await prisma.memberAnalytics.updateMany({
    data: {
      profileViews: 0,
      callClicks: 0,
      waClicks: 0,
      webClicks: 0,
      shareCount: 0
    }
  })
  console.log(`Successfully reset analytics for ${result.count} members!`)
}

main().catch(console.error)
