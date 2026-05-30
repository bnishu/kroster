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
  variant?: 'grid' | 'list'
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

export function MemberCard({ member, index = 0, variant = 'grid' }: MemberCardProps) {
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

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        onClick={handleCardClick}
        className="member-list-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 16px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, overflow: 'hidden',
          flexShrink: 0, position: 'relative',
          border: `2px solid ${accentColor}30`,
        }}>
          <Image
            src={member.profileImage || '/uploads/default-avatar.png'}
            alt={toTitleCase(member.fullName)}
            fill
            sizes="44px"
            style={{ objectFit: 'cover', objectPosition: 'top center' }}
          />
        </div>

        {/* Name + Business */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {toTitleCase(member.fullName)}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {toTitleCase(member.businessName)}
          </div>
        </div>

        {/* Category pill */}
        {member.category && (
          <div className="member-list-category" style={{
            padding: '3px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {toTitleCase(member.category.name)}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {member.phone && (
            <a href={`tel:${member.phone}`} title="Call" style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(182, 31, 43, 0.12)', border: '1px solid rgba(182, 31, 43, 0.35)',
              color: '#E85464',
            }}>
              <Phone size={12} />
            </a>
          )}
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.35)',
              color: '#25D366',
            }}>
              <MessageCircle size={12} />
            </a>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight size={14} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
      </motion.div>
    )
  }

  return (
    <>
      {/* ── MOBILE LAYOUT (HORIZONTAL) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "50px" }}
        whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.1)' }}
        transition={{ duration: 0.4 }}
        onClick={handleCardClick}
        className={`w-full flex flex-row items-center md:hidden ${config.cssClass}`}
        style={{
          padding: '16px',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top-Right Coordinator Ribbon */}
        {member.teamRole && (
          <div style={{
            position: 'absolute',
            top: 14,
            right: -32,
            width: 120,
            transform: 'rotate(45deg)',
            background: 'linear-gradient(135deg, #E62738, #9B1420)',
            color: '#fff',
            fontSize: 7.5,
            fontWeight: 850,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 0',
            boxShadow: '0 4px 10px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.4)',
            zIndex: 10,
            textAlign: 'center',
          }}>
            {member.teamRole}
          </div>
        )}

        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
          opacity: 0.3,
        }} />

        {/* Profile Photo - Left Side */}
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
          border: `2px solid ${accentColor}30`,
          boxShadow: `0 0 20px ${accentColor}20`
        }}>
          <Image
            src={member.profileImage || "/uploads/default-avatar.png"}
            alt={toTitleCase(member.fullName)}
            fill
            sizes="110px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Info - Right Side */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Name and Role Pill */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {toTitleCase(member.fullName)}
            </div>
            
            {/* Role Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 6,
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}40`,
              color: accentColor,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {roleLabel}
            </div>
          </div>

          {/* Business Name */}
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {toTitleCase(member.businessName)}
          </div>

          {/* Category Pill and Socials row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            {member.category && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 10,
                fontWeight: 600,
                width: 'fit-content'
              }}>
                {toTitleCase(member.category.name)}
              </div>
            )}

            {/* Social / Action Icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {member.phone && (
                <a href={`tel:${member.phone}`} style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                  <Phone size={14} />
                </a>
              )}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                  <MessageCircle size={14} />
                </a>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                  <Globe size={14} />
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
              {member.instagram && (
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {member.facebook && (
                <a href={member.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── DESKTOP LAYOUT (PORTRAIT) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "50px" }}
        transition={{ duration: 0.4 }}
        onClick={handleCardClick}
        className={`member-card w-full !hidden md:!flex flex-col ${config.cssClass}`}
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
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'flex-start',
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
                marginTop: 3,
                borderRadius: '50%',
                backgroundColor: accentColor,
                boxShadow: `0 0 6px ${accentColor}`,
                flexShrink: 0,
              }} />
              {roleLabel}
            </span>
          </div>

          {/* Top-Right Coordinator Ribbon */}
          {member.teamRole && (
            <div style={{
              position: 'absolute',
              top: 26,
              right: -46,
              width: 180,
              transform: 'rotate(45deg)',
              background: 'linear-gradient(135deg, #E62738, #9B1420)',
              color: '#fff',
              fontSize: 9.5,
              fontWeight: 850,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '6px 0',
              boxShadow: '0 6px 20px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.4)',
              zIndex: 10,
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}>
              <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '0 32px',
              }}>
                {member.teamRole}
              </div>
            </div>
          )}
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
              {toTitleCase(member.businessName)}
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
    </>
  )
}

// CSS for list row hover — inject via style tag in parent or global styles
// .member-list-row:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; }
