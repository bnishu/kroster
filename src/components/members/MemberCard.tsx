'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Globe, ArrowRight } from 'lucide-react'
import { getWhatsAppUrl, toTitleCase, getMemberRoleLabel } from '@/lib/utils'
import type { MemberCardData } from '@/types'

type MemberCardProps = {
  member: MemberCardData
  index?: number
}

const roleConfig = {
  ED: {
    accentColor: '#D4AF37', // Gold
    roleLabel: 'Executive Director',
    badgeClass: 'badge-ed',
    cssClass: 'member-card-ed',
  },
  SUPPORT: {
    accentColor: '#E85464', // Ruby Red
    roleLabel: 'Support Team',
    badgeClass: 'badge-support',
    cssClass: 'member-card-support',
  },
  HEAD_TABLE: {
    accentColor: '#D4AF37', // Gold for custom titles (or keep lavender indigo, let's use Gold if they are President/Vice President to make it luxurious!)
    roleLabel: 'Head Table',
    badgeClass: 'badge-headtable',
    cssClass: 'member-card-headtable',
  },
  MEMBER: {
    accentColor: '#38bdf8', // Sapphire Cyan
    roleLabel: 'Member',
    badgeClass: 'badge-member',
    cssClass: 'member-card-member',
  },
}

export function MemberCard({ member, index = 0 }: MemberCardProps) {
  const router = useRouter()
  const config = roleConfig[member.memberRole] || roleConfig.MEMBER
  const roleLabel = getMemberRoleLabel(member.memberRole, member.fullName)
  const isLeadership = member.memberRole === 'HEAD_TABLE' && roleLabel !== 'Head Table'
  // Use gold color for key leaders (President/Vice President) for premium aesthetics
  const accentColor = isLeadership ? '#D4AF37' : config.accentColor
  const waUrl = member.whatsapp ? getWhatsAppUrl(member.whatsapp) : null

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicked on action buttons or social links, do not trigger card-wide navigation
    if ((e.target as HTMLElement).closest('a, button')) return
    router.push(`/members/${member.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onClick={handleCardClick}
      className={`member-card ${config.cssClass}`}
    >
      {/* Portrait Photo Container */}
      <div className="member-card-photo">
        <Image
          src={member.profileImage || "/uploads/default-avatar.png"}
          alt={toTitleCase(member.fullName)}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          priority={index < 8}
          style={{
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
        />
        {/* Soft bottom blend mask */}
        <div className="member-card-overlay" />

        {/* Top-Left Glassmorphic Role Badge */}
        <div className="member-card-badge">
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${accentColor}20`,
            color: accentColor,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 6px ${accentColor}`,
            }} />
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Info and Action Box */}
      <div className="member-card-info">
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {toTitleCase(member.fullName)}
          </div>
          
          <div style={{
            color: accentColor,
            fontSize: 12,
            fontWeight: 600,
            marginTop: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            opacity: 0.95,
          }}>
            {member.businessName}
          </div>

          {member.category && (
            <div style={{
              display: 'inline-flex',
              marginTop: 6,
              padding: '2px 8px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}>
              {toTitleCase(member.category.name)}
            </div>
          )}
        </div>

        {/* Hover-reveal action bar */}
        <div className="member-card-actions">
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(182, 31, 43, 0.12)',
                border: '1px solid rgba(182, 31, 43, 0.35)',
                color: '#E85464',
              }}
              title="Call"
            >
              <Phone size={12} />
            </a>
          )}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.35)',
                color: '#25D366',
              }}
              title="WhatsApp"
            >
              <MessageCircle size={12} />
            </a>
          )}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 164, 239, 0.12)',
                border: '1px solid rgba(0, 164, 239, 0.35)',
                color: '#00A4EF',
              }}
              title="Website"
            >
              <Globe size={12} />
            </a>
          )}
          <Link
            href={`/members/${member.slug}`}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: accentColor,
              border: `1px solid ${accentColor}40`,
              color: '#050505',
              fontSize: 10.5,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>Profile</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

