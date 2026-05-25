import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Crown, Shield, Star, Users } from 'lucide-react'
import { getMemberRoleLabel, toTitleCase } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Members | Admin — BNI Krypton' }

const roleBadge: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  ED:         { label: 'ED',         bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37', icon: Crown  },
  HEAD_TABLE: { label: 'Head Table', bg: 'rgba(129,140,248,0.12)', color: '#818cf8', icon: Star   },
  SUPPORT:    { label: 'Support',    bg: 'rgba(232,84,100,0.12)',  color: '#E85464', icon: Shield },
  MEMBER:     { label: 'Member',     bg: 'rgba(56,189,248,0.10)',  color: '#38bdf8', icon: Users  },
}

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({
    orderBy: [{ memberRole: 'asc' }, { fullName: 'asc' }],
    include: { category: true }
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 36,
        paddingBottom: 24,
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{
            color: '#F0F0F0',
            fontSize: 28,
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}>
            Members Directory
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, fontWeight: 500 }}>
            {members.length} registered active and leadership members
          </p>
        </div>
        <Link href="/admin/members/new" className="btn-primary" style={{
          fontSize: 13.5,
          fontWeight: 700,
          padding: '12px 24px',
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(182,31,43,0.3)',
        }}>
          <Plus size={15} /> Add New Member
        </Link>
      </div>

      {/* Table Card Wrapper */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20,
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ minWidth: 800 }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Member Details</th>
                <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Role / Status</th>
                <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Business Category</th>
                <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Directory Status</th>
                <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const badge = roleBadge[member.memberRole] ?? roleBadge.MEMBER
                const BadgeIcon = badge.icon
                return (
                  <tr key={member.id} className="transition-colors hover:bg-white/[0.02]">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          overflow: 'hidden', position: 'relative', flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: '#111111'
                        }}>
                          <Image
                            src={member.profileImage || '/uploads/default-avatar.png'}
                            alt={toTitleCase(member.fullName)}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top center' }}
                          />
                        </div>
                        <div>
                          <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em' }}>
                            {toTitleCase(member.fullName)}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: 12, marginTop: 2 }}>
                            {member.businessName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px', borderRadius: 8,
                        background: badge.bg, color: badge.color,
                        fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        border: `1px solid ${badge.color}25`
                      }}>
                        <BadgeIcon size={12} />
                        {getMemberRoleLabel(member.memberRole, member.fullName)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.55)', fontSize: 13.5, fontWeight: 500 }}>
                      {member.category?.name ? toTitleCase(member.category.name) : <span style={{ color: 'rgba(255,255,255,0.20)' }}>—</span>}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px', borderRadius: 8,
                        background: member.isActive ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
                        color: member.isActive ? '#4ade80' : '#f87171',
                        fontSize: 11, fontWeight: 700,
                        border: member.isActive ? '1px solid rgba(34,197,94,0.20)' : '1px solid rgba(239,68,68,0.20)'
                      }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: member.isActive ? '#4ade80' : '#f87171',
                          display: 'inline-block',
                        }} />
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <Link href={`/admin/members/${member.id}/edit`} className="admin-edit-btn" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: 12.5, fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}>
                        <Pencil size={12} style={{ color: '#D4AF37' }} /> Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.30)' }}>
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
