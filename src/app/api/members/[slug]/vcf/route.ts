import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const member = await prisma.member.findUnique({
    where: { slug, isActive: true },
    include: { category: true }
  })

  if (!member) {
    return new NextResponse('Member not found', { status: 404 })
  }

  const fullName = member.fullName.trim()
  const nameParts = fullName.split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  const categoryName = member.category?.name || ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${fullName}`,
    `ORG:${member.businessName}`,
    member.phone ? `TEL;TYPE=CELL,VOICE:${member.phone}` : '',
    member.email ? `EMAIL;TYPE=PREF,INTERNET:${member.email}` : '',
    member.website ? `URL:${member.website}` : '',
    member.address ? `ADR:;;${member.address};;;` : '',
    categoryName ? `TITLE:${categoryName}` : '',
    categoryName ? `CATEGORIES:${categoryName}` : '',
    `NOTE:BNI Krypton Member - ${member.memberRole}`,
    'END:VCARD',
  ].filter(Boolean)

  const vcf = lines.join('\r\n')

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${member.slug}.vcf"`,
    },
  })
}
