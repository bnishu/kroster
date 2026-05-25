'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Globe, User, Crown } from 'lucide-react'
import { getWhatsAppUrl, toTitleCase } from '@/lib/utils'
import type { MemberCardData } from '@/types'

const config = {
  accentColor: '#D4AF37', // Gold
  glowColor: 'rgba(212, 175, 55, 0.25)',
  canvasBg: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(212, 175, 55, 0.03))',
  canvasBorder: '1px solid rgba(212, 175, 55, 0.16)',
  roleLabel: 'Executive Director',
}

export function EDCard({ member, index = 0 }: { member: MemberCardData; index?: number }) {
  const [hovered, setHovered] = useState(false)
  const waUrl = member.whatsapp ? getWhatsAppUrl(member.whatsapp) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        height: 410,
        borderRadius: 24,
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      {/* The Overlapping Portrait Canvas Wrapper (Height: 250px) */}
      <div style={{
        position: 'relative',
        height: 250,
        width: '100%',
        overflow: 'visible',
      }}>
        {/* 1. The Background Canvas */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 190,
          borderRadius: 24,
          background: config.canvasBg,
          border: hovered ? `1px solid ${config.accentColor}` : config.canvasBorder,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: hovered
            ? `0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 25px ${config.glowColor}`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />

        {/* 2. The Popping Profile Image Container (stands 60px taller) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 250,
          overflow: 'visible',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}>
          {/* Internal Image wrapper to clip only at the bottom radius */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}>
            {/* The Image */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 250,
              overflow: 'hidden',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              transform: hovered ? 'scale(1.06) translateY(-6px)' : 'scale(1) translateY(0)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <Image
                src={member.profileImage || "/uploads/default-avatar.png"}
                alt={toTitleCase(member.fullName)}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top center',
                }}
              />
              {/* Torso blend mask */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '35%',
                background: 'linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.95))',
              }} />
            </div>
          </div>
        </div>

        {/* Floating badge positioned over the canvas */}
        <div style={{
          position: 'absolute',
          top: 72,
          right: 12,
          zIndex: 10,
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${config.accentColor}25`,
            color: config.accentColor,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            <Crown size={10} style={{ marginRight: 2 }} />
            {config.roleLabel}
          </span>
        </div>
      </div>

      {/* Details & Actions Area */}
      <div style={{
        marginTop: 12,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0 8px 8px 8px',
      }}>
        <div>
          <div style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {toTitleCase(member.fullName)}
          </div>
          
          <div style={{
            color: config.accentColor,
            fontSize: 12,
            fontWeight: 600,
            marginTop: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            opacity: 0.9,
          }}>
            {member.businessName}
          </div>

          {member.category && (
            <div style={{
              display: 'inline-flex',
              marginTop: 6,
              padding: '2px 8px',
              borderRadius: 6,
              background: `${config.accentColor}0a`,
              border: `1px solid ${config.accentColor}18`,
              color: 'rgba(255,255,255,0.5)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}>
              {toTitleCase(member.category.name)}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{
          display: 'flex',
          gap: 6,
          marginTop: 12,
          opacity: hovered ? 1 : 0.85,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
              title="Call"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(34,197,94,0.15)';
                e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)';
                e.currentTarget.style.color = '#4ade80';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              <Phone size={12} />
            </a>
          )}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
              title="WhatsApp"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(37,211,102,0.15)';
                e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)';
                e.currentTarget.style.color = '#25D366';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              <MessageCircle size={12} />
            </a>
          )}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
              title="Website"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                e.currentTarget.style.color = '#818cf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
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
              gap: 6,
              background: hovered
                ? `linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}cc)`
                : 'rgba(255,255,255,0.05)',
              border: hovered
                ? `1px solid ${config.accentColor}40`
                : '1px solid rgba(255,255,255,0.08)',
              color: hovered ? '#050505' : '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: hovered 
                ? `0 4px 12px ${config.glowColor.replace('0.25', '0.1').replace('0.2', '0.08')}`
                : 'none',
            }}
          >
            <User size={11} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
