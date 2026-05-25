import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MemberCard } from '@/components/members/MemberCard'
import type { Metadata } from 'next'
import { toTitleCase } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      members: {
        where: { isActive: true },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: [{ memberRole: 'asc' }, { displayOrder: 'asc' }, { fullName: 'asc' }]
      }
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${toTitleCase(category.name)} Members`,
    description: category.description || `Browse BNI Krypton members in the ${toTitleCase(category.name)} category.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  const sorted = [...category.members].sort((a, b) =>
    toTitleCase(a.fullName).localeCompare(toTitleCase(b.fullName))
  )

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#090909', paddingTop: 68 }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(180deg, #161616 0%, #090909 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 0 36px',
        }}>
          <div className="container-main">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Link href="/#members" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
              }}>
                <ArrowLeft size={13} /> All Members
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: 13 }}>/</span>
              <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: 13 }}>{toTitleCase(category.name)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 7,
                  background: 'rgba(182,31,43,0.08)', border: '1px solid rgba(182,31,43,0.18)',
                  color: '#B61F2B', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10,
                }}>
                  Category
                </div>
                <h1 style={{
                  color: '#F0F0F0',
                  fontSize: 'clamp(24px, 4vw, 38px)',
                  fontWeight: 800,
                  fontFamily: '"Playfair Display", serif',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}>
                  {toTitleCase(category.name)}
                </h1>
                {category.description && (
                  <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 15, marginTop: 8, maxWidth: 520, lineHeight: 1.65 }}>
                    {category.description}
                  </p>
                )}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <Users size={15} style={{ color: 'rgba(255,255,255,0.40)' }} />
                <span style={{ color: '#F0F0F0', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>
                  {category.members.length}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="container-main" style={{ paddingTop: 48, paddingBottom: 80 }}>
          {sorted.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
              gap: 20,
            }}>
              {sorted.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20,
            }}>
              <Users size={40} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
              <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 16 }}>No members in this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
