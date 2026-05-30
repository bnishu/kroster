'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Shield, Star, Users, ChevronLeft, ChevronRight, Search } from 'lucide-react'
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
function SectionHeader({ icon: Icon, title, subtitle, color }: {
  icon: React.ElementType
  title: string
  subtitle: string
  color: string
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
        {subtitle && (
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
        )}
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
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Mobile Sticky Search Bar */}
      <div className="md:hidden sticky z-50 p-4 pt-6 pb-6" style={{ top: 64, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(10,10,10,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'relative', margin: '0 auto', maxWidth: '400px' }}>
          <input
            type="search"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%', 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', 
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 24, 
              padding: '14px 16px 14px 44px', 
              color: '#fff', 
              fontSize: 15, 
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05)'
            }}
          />
          <Search size={18} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      <HeroSection nextEvent={events[0]} />

      {/* ══ MEMBER SECTIONS ═════════════════════════════════════════════ */}
      <div id="members" className="container-main px-2 md:px-6 pt-4 pb-20">
        
        {/* ── EDs and Support Combined ── */}
        <AnimatePresence mode="popLayout">
          {(fEDs.length > 0 || fSupport.length > 0) && (
            <motion.div key="eds-support" layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full mb-8 md:mb-[60px]"
            >
              {fEDs.length > 0 && (
                <div className={`flex flex-col ${fSupport.length > 0 ? 'lg:col-span-2' : 'lg:col-span-5'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)',
                    borderRadius: 32, padding: '24px', border: '1px solid rgba(212,175,55,0.15)', boxShadow: 'inset 0 1px 1px rgba(212,175,55,0.1)'
                  }}
                >
                  <SectionHeader icon={Crown} title="Executive Directors" subtitle="" color="#D4AF37" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full justify-center">
                    <AnimatePresence mode="popLayout">
                      {fEDs.map((m, i) => (
                        <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10px" }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex w-full" style={{ width: '100%' }}>
                          <MemberCard member={m} index={i} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {fSupport.length > 0 && (
                <div className={`flex flex-col ${fEDs.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,84,100,0.06) 0%, rgba(232,84,100,0.02) 100%)',
                    borderRadius: 32, padding: '24px', border: '1px solid rgba(232,84,100,0.15)', boxShadow: 'inset 0 1px 1px rgba(232,84,100,0.1)'
                  }}
                >
                  <SectionHeader icon={Shield} title="Support Team" subtitle="Chapter Support" color="#E85464" />
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full justify-center`}>
                    <AnimatePresence mode="popLayout">
                      {fSupport.map((m, i) => (
                        <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10px" }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex w-full" style={{ width: '100%' }}>
                          <MemberCard member={m} index={i} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Head Table ── */}
        <AnimatePresence mode="popLayout">
          {fHead.length > 0 && (
            <motion.section key="headtable" layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} 
              className="mb-8 md:mb-[60px]"
              style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
            >
              <SectionHeader icon={Star} title="Chapter Leadership" subtitle="Head Table" color="#818cf8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <AnimatePresence mode="popLayout">
                  {fHead.map((m, i) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10px" }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex w-full" style={{ width: '100%' }}>
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
            <motion.section key="members" layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="mb-8 md:mb-[60px]"
              style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
            >
              <SectionHeader icon={Users} title="Active Professionals" subtitle="Chapter Members" color="#38bdf8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-6">
                <AnimatePresence mode="popLayout">
                  {fMembers.map((m, i) => (
                    <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10px" }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex w-full" style={{ width: '100%' }}>
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

      <EventsSection events={events.slice(0, 6)} />
      <VacantCategories categories={vacantCategories} />
    </div>
  )
}

