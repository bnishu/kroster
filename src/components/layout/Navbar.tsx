'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LayoutDashboard, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#members', label: 'Members' },
  { href: '/#events', label: 'Events' },
]

function NavbarSearch({ mobile }: { mobile?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams ? searchParams.get('q') || '' : ''
  const [searchVal, setSearchVal] = useState(currentQuery)

  useEffect(() => {
    setSearchVal(currentQuery)
  }, [currentQuery])

  const handleSearchChange = (val: string) => {
    setSearchVal(val)
    if (val.trim()) {
      router.push(`/?q=${encodeURIComponent(val)}`)
    } else {
      router.push('/')
    }
  }

  if (mobile) {
    return (
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="search"
          value={searchVal}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Search members..."
          style={{
            width: '100%',
            height: 44,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '0 16px 0 42px',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            transition: 'all 0.2s',
          }}
          className="focus:border-[#B61F2B]"
        />
        {searchVal && (
          <button 
            onClick={() => handleSearchChange('')} 
            style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
              display: 'flex', padding: 2
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="desktop-search" style={{ position: 'relative', display: 'none', alignItems: 'center', width: 280 }}>
      <Search size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input
        type="search"
        value={searchVal}
        onChange={e => handleSearchChange(e.target.value)}
        placeholder="Search members..."
        style={{
          width: '100%',
          height: 36,
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '0 12px 0 36px',
          color: '#fff',
          fontSize: 13,
          outline: 'none',
          transition: 'all 0.2s',
        }}
        className="focus:border-[#B61F2B] focus:bg-white/[0.07]"
      />
      {searchVal && (
        <button 
          onClick={() => handleSearchChange('')} 
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
            display: 'flex', padding: 2
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const solid = scrolled || mobileOpen

  return (
    <>
      {/* Top accent stripe */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, zIndex: 60,
        background: 'linear-gradient(90deg, #7A111B 0%, #B61F2B 30%, #D4AF37 50%, #B61F2B 70%, #7A111B 100%)',
      }} />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 2, left: 0, right: 0,
          zIndex: 50,
          height: 66,
          background: solid ? 'rgba(9,9,9,0.94)' : 'transparent',
          borderBottom: solid ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          backdropFilter: solid ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(20px)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.55)' : 'none',
        } as React.CSSProperties}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, #B61F2B 0%, #6e0f19 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(182,31,43,0.45)',
              position: 'relative',
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 11, fontFamily: '"Playfair Display", serif', letterSpacing: '0.02em' }}>BNI</span>
              <div style={{
                position: 'absolute', top: -3, right: -3,
                width: 8, height: 8, borderRadius: '50%',
                background: '#D4AF37',
                border: '2px solid #090909',
                boxShadow: '0 0 7px rgba(212,175,55,0.7)',
              }} />
            </div>
            <div>
              <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: 14, lineHeight: 1.15, letterSpacing: '-0.01em' }}>BNI Krypton</div>
              <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>Nagpur Chapter</div>
            </div>
          </Link>
 
          {/* Desktop Search Bar wrapped in Suspense */}
          <Suspense fallback={
            <div className="desktop-search" style={{ position: 'relative', display: 'none', alignItems: 'center', width: 280 }}>
              <div style={{ width: '100%', height: 36, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            </div>
          }>
            <NavbarSearch />
          </Suspense>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 2 }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '7px 13px',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.55)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.18s ease, background 0.18s ease',
                letterSpacing: '-0.01em',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-actions" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 15px', borderRadius: 9,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.11)',
              color: 'rgba(255,255,255,0.60)',
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.18s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.06)';
                el.style.color = '#fff';
                el.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.color = 'rgba(255,255,255,0.60)';
                el.style.borderColor = 'rgba(255,255,255,0.11)';
              }}
            >
              <LogIn size={13} /> Login
            </Link>
            <Link href="/admin" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 15px', borderRadius: 9,
              background: 'linear-gradient(135deg, #B61F2B, #7A111B)',
              color: '#fff',
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(182,31,43,0.40)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'opacity 0.18s ease, transform 0.15s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.opacity = '0.87';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }}
            >
              <LayoutDashboard size={13} /> Dashboard
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 9,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#fff', cursor: 'pointer',
            }}
          >
            <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 68, left: 0, right: 0, bottom: 0,
              zIndex: 40,
              background: 'rgba(7,7,7,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '20px 24px 32px',
              display: 'flex', flexDirection: 'column',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Mobile Search input wrapped in Suspense */}
              <Suspense fallback={
                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <div style={{ width: '100%', height: 44, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
                </div>
              }>
                <NavbarSearch mobile />
              </Suspense>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.22 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '18px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 24, fontWeight: 700,
                      fontFamily: '"Playfair Display", serif',
                      textDecoration: 'none',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 20 }}
            >
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.11)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                textDecoration: 'none',
              }}>
                <LogIn size={15} /> Login
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px', borderRadius: 12,
                background: 'linear-gradient(135deg, #B61F2B, #7A111B)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(182,31,43,0.4)',
              }}>
                <LayoutDashboard size={15} /> Admin Dashboard
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .desktop-search { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  )
}
