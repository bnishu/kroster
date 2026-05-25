import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Event } from '@prisma/client'

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function EventsSection({ events }: { events: Event[] }) {
  if (!events.length) return null

  return (
    <section id="events" style={{ paddingTop: 96, paddingBottom: 96, position: 'relative' }}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#0D0305] to-[#111111] pointer-events-none" />

      <div className="container-main relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B61F2B]/10 border border-[#B61F2B]/20 text-[#B61F2B] text-sm font-semibold mb-4">
            <Calendar className="w-4 h-4" />
            Upcoming Events
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display'] mb-4">
            Connect at Our Events
          </h2>
          <p className="text-white/60 text-sm max-w-2xl mx-auto leading-relaxed">
            Join weekly BNI meetings and special chapter events to grow your referral network.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => {
            const isMilestone = event.slug === '300th-milestone-meeting';
            const isFvd = event.slug === 'focus-visitors-day-2026';
            const isBizTalk = event.slug === 'biztalk-show-may-2026';

            let borderStyle = '1px solid rgba(255, 255, 255, 0.07)';
            let shadowStyle = '0 8px 32px rgba(0, 0, 0, 0.5)';
            let cardBg = 'linear-gradient(180deg, #141414 0%, #0d0d0d 100%)';
            let badgeText = '';

            if (isMilestone) {
              borderStyle = '1px solid rgba(212, 175, 55, 0.45)';
              shadowStyle = '0 12px 40px rgba(212, 175, 55, 0.14), 0 0 25px rgba(212, 175, 55, 0.06)';
              cardBg = 'linear-gradient(135deg, #1a1712 0%, #0d0c0a 100%)';
              badgeText = '👑 landmark 300th meeting';
            } else if (isFvd) {
              borderStyle = '1px solid rgba(182, 31, 43, 0.45)';
              shadowStyle = '0 12px 40px rgba(182, 31, 43, 0.14), 0 0 25px rgba(182, 31, 43, 0.06)';
              cardBg = 'linear-gradient(135deg, #1b1213 0%, #0e0a0a 100%)';
              badgeText = '🚀 focus visitors day (fvd)';
            } else if (isBizTalk) {
              borderStyle = '1px solid rgba(56, 189, 248, 0.45)';
              shadowStyle = '0 12px 40px rgba(56, 189, 248, 0.14), 0 0 25px rgba(56, 189, 248, 0.06)';
              cardBg = 'linear-gradient(135deg, #12181b 0%, #0a0e10 100%)';
              badgeText = '🎤 BizTalk Special';
            }

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{
                  background: cardBg,
                  border: borderStyle,
                  borderRadius: 20,
                  boxShadow: shadowStyle,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
                className={`premium-card group ${isMilestone ? 'glow-gold' : isFvd ? 'glow-red' : isBizTalk ? 'glow-blue' : ''}`}
              >
                {/* Event Image or Placeholder */}
                {event.image ? (
                  <div className="h-48 bg-gradient-to-br from-[#B61F2B]/15 to-[#7A111B]/5 relative overflow-hidden">
                    <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Date Badge Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                      <div style={{
                        background: 'rgba(9, 9, 9, 0.85)',
                        backdropFilter: 'blur(12px)',
                        border: isMilestone ? '1px solid rgba(212, 175, 55, 0.4)' : isFvd ? '1px solid rgba(182, 31, 43, 0.4)' : isBizTalk ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 12,
                        padding: '8px 14px',
                        textAlign: 'center',
                        minWidth: 54,
                      }}>
                        <div style={{ color: isMilestone ? '#D4AF37' : isBizTalk ? '#38BDF8' : '#F0F0F0', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>
                          {new Date(event.eventDate).getDate()}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginTop: 3 }}>
                          {new Date(event.eventDate).toLocaleString('en', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Event Content Details */}
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {!event.image && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        {badgeText ? (
                          <span style={{
                            display: 'inline-flex',
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: isMilestone ? 'rgba(212, 175, 55, 0.12)' : isFvd ? 'rgba(182, 31, 43, 0.12)' : isBizTalk ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                            border: isMilestone ? '1px solid rgba(212, 175, 55, 0.25)' : isFvd ? '1px solid rgba(182, 31, 43, 0.25)' : isBizTalk ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: isMilestone ? '#D4AF37' : isFvd ? '#E85464' : isBizTalk ? '#38BDF8' : '#ffffff',
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            {badgeText}
                          </span>
                        ) : <div />}
                        
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: isMilestone ? '1px solid rgba(212, 175, 55, 0.3)' : isFvd ? '1px solid rgba(182, 31, 43, 0.3)' : isBizTalk ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 8,
                          padding: '4px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>
                            {new Date(event.eventDate).getDate()}
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                            {new Date(event.eventDate).toLocaleString('en', { month: 'short' })}
                          </span>
                        </div>
                      </div>
                    )}

                    {event.image && badgeText && (
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: isMilestone ? 'rgba(212, 175, 55, 0.12)' : isFvd ? 'rgba(182, 31, 43, 0.12)' : isBizTalk ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        border: isMilestone ? '1px solid rgba(212, 175, 55, 0.25)' : isFvd ? '1px solid rgba(182, 31, 43, 0.25)' : isBizTalk ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isMilestone ? '#D4AF37' : isFvd ? '#E85464' : isBizTalk ? '#38BDF8' : '#ffffff',
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 12,
                      }}>
                        {badgeText}
                      </span>
                    )}

                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.35,
                      marginBottom: 16,
                      letterSpacing: '-0.01em',
                      fontFamily: 'Inter, sans-serif',
                    }} className="group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255, 255, 255, 0.5)', fontSize: 13 }}>
                        <Calendar className="w-4 h-4 text-[#B61F2B] flex-shrink-0" />
                        <span>{formatEventDate(event.eventDate)}</span>
                      </div>

                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255, 255, 255, 0.5)', fontSize: 13 }}>
                          <MapPin className="w-4 h-4 text-[#B61F2B] flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {event.description && (
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      marginTop: 16,
                      whiteSpace: 'pre-line',
                    }} className={isMilestone || isFvd || isBizTalk ? "" : "line-clamp-3"}>
                      {event.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
