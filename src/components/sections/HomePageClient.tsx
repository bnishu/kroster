'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Shield, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { MemberCard } from '@/components/members/MemberCard'
import { VacantCategories } from '@/components/sections/VacantCategories'
import type { Member, Event } from '@prisma/client'
import { toTitleCase } from '@/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import { EventsSection } from '@/components/sections/EventsSection'

type MemberWithCategory = Member & {
  category?: { name: string; slug: string } | null
}

type Props = {
  eds: MemberWithCategory[]
  support: MemberWithCategory[]
  headTable: MemberWithCategory[]
  members: MemberWithCategory[]
  events: Event[]
  vacantCategories?: string[]
}

// ── Left-aligned Premium Section Header ─────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color, count }: {
  icon: React.ElementType
  title: string
  subtitle: string
  color: string
  count: number
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      paddingBottom: 16,
      marginBottom: 32,
      marginTop: 8,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color,
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
          }} />
          {subtitle}
        </div>
        <h2 style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h2>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 8,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 500 }}>
          Count
        </span>
        <span style={{
          fontWeight: 700,
          fontSize: 12,
          color,
          background: `${color}12`,
          padding: '1px 7px',
          borderRadius: 4,
        }}>
          {count}
        </span>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export function HomePageClient({ eds, support, headTable, members, events, vacantCategories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams ? searchParams.get('q') || '' : ''
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -240, behavior: 'smooth' })
  }
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 240, behavior: 'smooth' })
  }

  const allMembersList = useMemo(() => [...eds, ...support, ...headTable, ...members], [eds, support, headTable, members])

  const categories = useMemo(() => {
    const cats = new Map<string, number>()
    allMembersList.forEach(m => {
      if (m.category?.name) cats.set(m.category.name, (cats.get(m.category.name) || 0) + 1)
    })
    return Array.from(cats.entries()).sort((a, b) => b[1] - a[1])
  }, [allMembersList])

  const filterAndSortMembers = useCallback((list: MemberWithCategory[], sortByOrder = false) => {
    const filtered = list.filter(m => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch = !q ||
        m.fullName.toLowerCase().includes(q) ||
        m.businessName.toLowerCase().includes(q) ||
        m.category?.name.toLowerCase().includes(q) ||
        m.shortIntro?.toLowerCase().includes(q)
      const matchCat = !selectedCategory || m.category?.name === selectedCategory
      return matchSearch && matchCat
    })
    return [...filtered].sort((a, b) => {
      if (sortByOrder) {
        return (a.displayOrder || 999) - (b.displayOrder || 999)
      }
      const nameA = toTitleCase(a.fullName)
      const nameB = toTitleCase(b.fullName)
      return nameA.localeCompare(nameB)
    })
  }, [searchQuery, selectedCategory])

  const fEDs = filterAndSortMembers(eds, true)
  const fSupport = filterAndSortMembers(support, true)
  const fHead = filterAndSortMembers(headTable, true)
  const fMembers = filterAndSortMembers(members, false)
  const total = fEDs.length + fSupport.length + fHead.length + fMembers.length
  const isFiltering = !!searchQuery || !!selectedCategory

  const clearFilters = () => {
    router.push('/')
    setSelectedCategory(null)
  }

  const handleSearch = (val: string) => {
    if (val.trim()) {
      router.push(`/?q=${encodeURIComponent(val)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(182,31,43,0.05) 0%, #0A0A0A 100%)',
      minHeight: '100vh'
    }}>
      <HeroSection onSearch={handleSearch} />

      {/* ══ MEMBER SECTIONS ═════════════════════════════════════════════ */}
      <div id="members" className="container-main" style={{ padding: '40px 24px 80px' }}>
        
        {/* Category Filters Chip Grid Wrapper with navigation arrows */}
        <div style={{ position: 'relative', width: '100%', marginBottom: 32, padding: '0 40px' }}>
          {/* Left Arrow */}
          <button 
            onClick={scrollLeft}
            style={{
              position: 'absolute',
              left: 0,
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(9, 9, 9, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(182, 31, 43, 0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(9, 9, 9, 0.85)';
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={scrollRight}
            style={{
              position: 'absolute',
              right: 0,
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(9, 9, 9, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(182, 31, 43, 0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(9, 9, 9, 0.85)';
            }}
          >
            <ChevronRight size={16} />
          </button>

          <div 
            ref={scrollContainerRef}
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              paddingBottom: 16,
              scrollbarWidth: 'none',
            }}
            className="category-filter-chips scrollbar-none"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                flexShrink: 0,
                padding: '8px 18px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedCategory === null 
                  ? 'linear-gradient(135deg, #B61F2B, #7A111B)' 
                  : 'rgba(255,255,255,0.03)',
                border: selectedCategory === null 
                  ? '1px solid rgba(255,255,255,0.1)' 
                  : '1px solid rgba(255,255,255,0.08)',
                color: selectedCategory === null ? '#fff' : 'rgba(255,255,255,0.6)',
                boxShadow: selectedCategory === null ? '0 4px 14px rgba(182,31,43,0.3)' : 'none',
              }}
              onMouseEnter={e => {
                if (selectedCategory !== null) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (selectedCategory !== null) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                }
              }}
            >
              All Categories
            </button>
            {categories.map(([cat, count]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: '8px 18px',
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedCategory === cat 
                    ? 'linear-gradient(135deg, #B61F2B, #7A111B)' 
                    : 'rgba(255,255,255,0.03)',
                  border: selectedCategory === cat 
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : '1px solid rgba(255,255,255,0.08)',
                  color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.6)',
                  boxShadow: selectedCategory === cat ? '0 4px 14px rgba(182,31,43,0.3)' : 'none',
                }}
                onMouseEnter={e => {
                  if (selectedCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                  }
                }}
              >
                {toTitleCase(cat)} <span style={{ opacity: 0.4, fontSize: 11, marginLeft: 4 }}>({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Head Table ── */}
        <AnimatePresence mode="popLayout">
          {fHead.length > 0 && (
            <motion.section key="headtable" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} 
              style={{ marginBottom: 40, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', borderRadius: 32, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
            >
              <SectionHeader icon={Star} title="Chapter Leadership" subtitle="Head Table" color="#818cf8" count={fHead.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">
                <AnimatePresence mode="popLayout">
                  {fHead.map((m, i) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03, duration: 0.35 }}>
                      <MemberCard member={m} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── All Members ── */}
        <AnimatePresence mode="popLayout">
          {fMembers.length > 0 && (
            <motion.section key="members" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              style={{ marginBottom: 40, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', borderRadius: 32, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
            >
              <SectionHeader icon={Users} title="Active Professionals" subtitle="Chapter Members" color="#38bdf8" count={fMembers.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-6">
                <AnimatePresence mode="popLayout">
                  {fMembers.map((m, i) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.02, duration: 0.3 }}>
                      <MemberCard member={m} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Support ── */}
        <AnimatePresence mode="popLayout">
          {fSupport.length > 0 && (
            <motion.section key="support" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              style={{ marginBottom: 40, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', borderRadius: 32, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
            >
              <SectionHeader icon={Shield} title="Support Team" subtitle="Chapter Support" color="#E85464" count={fSupport.length} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6 justify-center">
                <AnimatePresence mode="popLayout">
                  {fSupport.map((m, i) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03, duration: 0.35 }}>
                      <MemberCard member={m} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── EDs ── */}
        <AnimatePresence mode="popLayout">
          {fEDs.length > 0 && (
            <motion.section key="eds" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              style={{ marginBottom: 40, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', borderRadius: 32, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
            >
              <SectionHeader icon={Crown} title="Executive Directors" subtitle="Leadership Team" color="#D4AF37" count={fEDs.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6 justify-center">
                <AnimatePresence mode="popLayout">
                  {fEDs.map((m, i) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03, duration: 0.35 }}>
                      <MemberCard member={m} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Empty ── */}
        <AnimatePresence>
          {total === 0 && isFiltering && (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '100px 24px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>
                No members found
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>
                Try adjusting your search or selecting a different category.
              </p>
              <button onClick={clearFilters} style={{
                padding: '11px 28px', borderRadius: 10,
                background: 'linear-gradient(135deg, #B61F2B, #7A111B)',
                color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                border: 'none',
                boxShadow: '0 6px 20px rgba(182,31,43,0.3)',
              }}>
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EventsSection events={events} />
      <VacantCategories categories={vacantCategories} />
    </div>
  )
}

