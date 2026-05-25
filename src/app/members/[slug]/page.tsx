import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getMemberRoleLabel, getWhatsAppUrl, toTitleCase } from '@/lib/utils'
import {
  Phone, MessageCircle, Globe, Mail, MapPin, Crown, Shield, Star, Users,
  Download, ArrowLeft, Clock,
} from 'lucide-react'
import { QRCard } from '@/components/members/QRCard'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

async function getMember(slug: string) {
  return prisma.member.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      testimonials: { where: { isPublic: true }, orderBy: { createdAt: 'desc' } },
      analytics: true,
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = await getMember(slug)
  if (!member) return { title: 'Member Not Found' }
  const formattedName = toTitleCase(member.fullName)
  return {
    title: `${formattedName} — ${member.businessName}`,
    description: member.shortIntro ?? `${formattedName} is a member of BNI Krypton, Nagpur.`,
    openGraph: {
      title: `${formattedName} | BNI Krypton`,
      description: member.shortIntro ?? '',
      images: member.profileImage ? [{ url: member.profileImage }] : [],
    },
  }
}

const roleAccentMap: Record<string, { color: string; glow: string; badgeClass: string; icon: React.ElementType }> = {
  ED:         { color: '#D4AF37', glow: 'rgba(212,175,55,0.18)',  badgeClass: 'badge-ed',        icon: Crown  },
  HEAD_TABLE: { color: '#818cf8', glow: 'rgba(129,140,248,0.18)', badgeClass: 'badge-headtable', icon: Star   },
  SUPPORT:    { color: '#E85464', glow: 'rgba(232,84,100,0.18)',  badgeClass: 'badge-support',   icon: Shield },
  MEMBER:     { color: '#38bdf8', glow: 'rgba(56,189,248,0.14)',  badgeClass: 'badge-member',    icon: Users  },
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
      borderRadius: 32,
      padding: '36px 40px',
    }}>
      <h2 style={{
        color: 'rgba(255,255,255,0.40)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default async function MemberProfilePage({ params }: Props) {
  const { slug } = await params
  const member = await getMember(slug)
  if (!member) notFound()

  const accent = roleAccentMap[member.memberRole] ?? roleAccentMap.MEMBER
  const RoleIcon = accent.icon
  const vcfUrl = `/api/members/${member.slug}/vcf`
  const waUrl = member.whatsapp ? getWhatsAppUrl(member.whatsapp) : null
  const name = toTitleCase(member.fullName)

  const fullName = member.fullName.trim()
  const nameParts = fullName.split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  const categoryName = member.category?.name || ''
  
  const vcardLines = [
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
    'END:VCARD',
  ].filter(Boolean)
  const vcardText = vcardLines.join('\r\n')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'LocalBusiness'],
    name: member.fullName,
    jobTitle: getMemberRoleLabel(member.memberRole, member.fullName),
    worksFor: { '@type': 'Organization', name: member.businessName },
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in'}/members/${member.slug}`,
    image: member.profileImage || '',
    description: member.shortIntro || '',
    telephone: member.phone || '',
    email: member.email || '',
    address: member.address || '',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main style={{ minHeight: '100vh', background: '#090909' }}>

        {/* ── Atmospheric Cover ──────────────────────────── */}
        <div style={{
          position: 'relative',
          height: 180,
          background: `
            radial-gradient(ellipse 65% 90% at 12% 60%, ${accent.glow} 0%, transparent 58%),
            radial-gradient(ellipse 45% 60% at 88% 20%, ${accent.glow.replace('0.18', '0.10').replace('0.14', '0.07')} 0%, transparent 55%),
            linear-gradient(180deg, #1a1212 0%, #0d0d0d 100%)
          `,
          overflow: 'hidden',
        }}>
          {/* Grid mesh */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '52px 52px',
            pointerEvents: 'none',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
            background: 'linear-gradient(to bottom, transparent, #090909)',
          }} />
        </div>

        <div className="container-main">

          {/* Back Button positioned elegantly above the profile card */}
          <div style={{ marginTop: -120, marginBottom: 80 }}>
            <Link href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.80)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }} className="hover-bg hover-text">
              <ArrowLeft size={14} /> Back to Directory
            </Link>
          </div>

          {/* ── Main Profile Header Card ─────────────────────────────── */}
          <div style={{ marginBottom: 32, position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 8px 48px rgba(0,0,0,0.5)',
              borderRadius: 32,
              padding: '40px',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                
                {/* Avatar with top-border overlap and custom accent badge */}
                <div style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: -86,
                  position: 'relative',
                  zIndex: 5,
                }}>
                  <div style={{
                    width: 140,
                    height: 140,
                    borderRadius: 20,
                    border: '4px solid #141414',
                    outline: `1px solid ${accent.color}45`,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    background: '#0d0d0d',
                  }}>
                    <Image
                      src={member.profileImage || '/uploads/default-avatar.png'}
                      alt={name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 140px"
                      className="object-cover"
                      style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  </div>
                  {/* Role badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${accent.badgeClass}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                    {getMemberRoleLabel(member.memberRole, member.fullName)}
                  </span>
                </div>

                {/* Info and action panel */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h1 style={{
                    color: '#F0F0F0',
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}>
                    {name}
                  </h1>
                  <p style={{ color: accent.color, fontSize: 18, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.01em' }}>
                    {member.businessName}
                  </p>
                  
                  {member.category && (
                    <span style={{
                      display: 'inline-flex',
                      padding: '4px 12px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'rgba(255,255,255,0.50)',
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      marginBottom: 24,
                    }}>
                      {toTitleCase(member.category.name)}
                    </span>
                  )}

                  {/* Divider */}
                  <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)', margin: '24px 0' }} />

                  {/* Action pills row */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="action-pill hover-bg" style={{
                        background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.20)', color: '#4ade80',
                      }}>
                        <Phone size={14} /> Call {member.phone}
                      </a>
                    )}
                    {waUrl && (
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="action-pill hover-bg" style={{
                        background: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.20)', color: '#25D366',
                      }}>
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="action-pill hover-bg" style={{
                        background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.20)', color: '#60a5fa',
                      }}>
                        <Mail size={14} /> Send Email
                      </a>
                    )}
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noopener noreferrer" className="action-pill hover-bg" style={{
                        background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.20)', color: '#a78bfa',
                      }}>
                        <Globe size={14} /> Visit Website
                      </a>
                    )}
                    <a href={vcfUrl} className="action-pill hover-bg" style={{
                      background: `${accent.color}0d`, borderColor: `${accent.color}28`, color: accent.color,
                    }}>
                      <Download size={14} /> Save Contact
                    </a>
                  </div>
                </div>

                {/* QR Card Share & Connect (Right Aligned in Desktop) */}
                <div style={{
                  flexShrink: 0,
                  width: '100%',
                  maxWidth: 540,
                  minWidth: 320,
                  marginLeft: 'auto',
                }}>
                  <QRCard
                    profileUrl={`${process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in'}/members/${member.slug}`}
                    whatsappUrl={getWhatsAppUrl(member.whatsapp || '')}
                    memberName={member.fullName}
                    vcardText={vcardText}
                  />
                </div>


              </div>
            </div>
          </div>

          {/* ── Stacked Profile Content (Single Column Layout) ── */}
          <div className="flex flex-col gap-6 w-full pb-20">

            {/* About Member & Contact Details Side-by-Side Grid */}
            <div className="profile-bento-bottom">
              <style>{`
                .profile-bento-bottom {
                  display: grid;
                  grid-template-columns: 1fr;
                  gap: 24px;
                  width: 100%;
                }
                @media (min-width: 900px) {
                  .profile-bento-bottom {
                    grid-template-columns: ${member.fullDescription ? '6.5fr 3.5fr' : '1fr'};
                  }
                }
              `}</style>
              {member.fullDescription && (
                <InfoSection title="About Member">
                  <p style={{ color: 'rgba(255,255,255,0.70)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' }}>
                    {member.fullDescription}
                  </p>
                </InfoSection>
              )}

              <InfoSection title="Contact Details">
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, listStyle: 'none' }}>
                  {member.address && (
                    <li style={{ display: 'flex', gap: 12, fontSize: 14.5 }}>
                      <MapPin size={16} style={{ color: accent.color, flexShrink: 0, marginTop: 3 }} />
                      <span style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{member.address}</span>
                    </li>
                  )}
                  {member.email && (
                    <li style={{ display: 'flex', gap: 12, fontSize: 14.5 }}>
                      <Mail size={16} style={{ color: accent.color, flexShrink: 0, marginTop: 3 }} />
                      <a href={`mailto:${member.email}`} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s', wordBreak: 'break-all' }} className="hover-text">
                        {member.email}
                      </a>
                    </li>
                  )}
                  {member.phone && (
                    <li style={{ display: 'flex', gap: 12, fontSize: 14.5 }}>
                      <Phone size={16} style={{ color: accent.color, flexShrink: 0, marginTop: 3 }} />
                      <a href={`tel:${member.phone}`} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-text">
                        {member.phone}
                      </a>
                    </li>
                  )}
                  {member.businessTiming && (
                    <li style={{ display: 'flex', gap: 12, fontSize: 14.5 }}>
                      <Clock size={16} style={{ color: accent.color, flexShrink: 0, marginTop: 3 }} />
                      <span style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{member.businessTiming}</span>
                    </li>
                  )}
                </ul>
              </InfoSection>
            </div>

            {member.services && (
              <InfoSection title="Services & Specialties">
                <p style={{ color: 'rgba(255,255,255,0.70)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' }}>
                  {member.services}
                </p>
              </InfoSection>
            )}

            {member.referralExpectation && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `4px solid ${accent.color}`,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                borderRadius: 32,
                padding: '36px 40px',
              }}>
                <h2 style={{
                  color: 'rgba(255,255,255,0.40)', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18,
                }}>
                  Looking for Referrals In
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.70)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' }}>
                  {member.referralExpectation}
                </p>
              </div>
            )}

            {/* Social Media Links */}
            {(member.linkedin || member.facebook || member.instagram || member.youtube) && (
              <InfoSection title="Social Media">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      className="action-pill hover-bg" style={{
                        background: 'rgba(10,102,194,0.06)', borderColor: 'rgba(10,102,194,0.18)', color: '#4f9cf9', fontSize: 13,
                      }}>
                      <Globe size={13} /> LinkedIn
                    </a>
                  )}
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noopener noreferrer"
                      className="action-pill hover-bg" style={{
                        background: 'rgba(24,119,242,0.06)', borderColor: 'rgba(24,119,242,0.18)', color: '#6ba3f9', fontSize: 13,
                      }}>
                      <Globe size={13} /> Facebook
                    </a>
                  )}
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer"
                      className="action-pill hover-bg" style={{
                        background: 'rgba(225,48,108,0.06)', borderColor: 'rgba(225,48,108,0.18)', color: '#f06292', fontSize: 13,
                      }}>
                      <Globe size={13} /> Instagram
                    </a>
                  )}
                  {member.youtube && (
                    <a href={member.youtube} target="_blank" rel="noopener noreferrer"
                      className="action-pill hover-bg" style={{
                        background: 'rgba(255,0,0,0.05)', borderColor: 'rgba(255,0,0,0.15)', color: '#f87171', fontSize: 13,
                      }}>
                      <Globe size={13} /> YouTube
                    </a>
                  )}
                </div>
              </InfoSection>
            )}

            {/* Testimonials */}
            {member.testimonials.length > 0 && (
              <InfoSection title={`Testimonials (${member.testimonials.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {member.testimonials.map((t) => (
                    <div key={t.id} style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12, padding: '20px 24px',
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14.5, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 16 }}>
                        &ldquo;{t.content}&rdquo;
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: `${accent.color}15`, border: `1px solid ${accent.color}25`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ color: accent.color, fontSize: 13, fontWeight: 700 }}>
                              {t.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 14, fontWeight: 600 }}>
                            {t.authorName}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={13} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoSection>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
