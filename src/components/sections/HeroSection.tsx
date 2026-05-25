'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react'

export function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const handleChange = (v: string) => {
    setQuery(v)
    onSearch(v)
  }
  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <section id="hero" style={{ 
      width: '100%', 
      paddingTop: 112, 
      paddingBottom: 64, 
      paddingLeft: 16, 
      paddingRight: 16, 
      position: 'relative', 
      overflow: 'hidden', 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      {/* Background gradients */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(182,31,43,0.15) 0%, rgba(10,10,10,1) 70%)',
      }} />
      
      {/* Subtle grid mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Bento Grid */}
        <div className="custom-bento-grid">
          
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bento-hero bento-card"
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '48px', position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Inner glow */}
            <div style={{
              position: 'absolute', top: -160, left: -160, width: 320, height: 320,
              background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none'
            }} />
            
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999,
              border: '1px solid rgba(234, 179, 8, 0.2)', background: 'rgba(234, 179, 8, 0.05)',
              color: '#eab308', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 32, width: 'fit-content'
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#eab308',
                boxShadow: '0 0 8px rgba(234, 179, 8, 0.8)', animation: 'pulse-glow 2s infinite'
              }} />
              BNI KRYPTON • NAGPUR
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#fff',
              letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24, fontFamily: '"Playfair Display", serif'
            }}>
              Connect With Trusted<br/>
              <span style={{
                background: 'linear-gradient(to right, #ef4444, #eab308)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                Elite Professionals
              </span>
            </h1>
            
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: 500, lineHeight: 1.6 }}>
              Discover Nagpur's most premium business networking chapter. Build your referral network today.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bento-search bento-card"
            style={{
              padding: '32px', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}
          >
            <div style={{
              position: 'absolute', bottom: -160, right: -160, width: 320, height: 320,
              background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
              transition: 'background 0.7s ease'
            }} />
            
            <div style={{ marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
              }}>
                <Search color="rgba(255,255,255,0.6)" size={24} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Quick Search</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Find members, businesses, or specific categories instantly.</p>
            </div>

            <div style={{ position: 'relative', marginTop: 'auto' }}>
              <input
                type="search"
                value={query}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search..."
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '16px 40px 16px 48px', color: '#fff', fontSize: 15,
                  outline: 'none', transition: 'all 0.2s',
                  boxShadow: focused ? 'inset 0 1px 1px rgba(255,255,255,0.05), 0 0 0 4px rgba(239, 68, 68, 0.1)' : 'inset 0 1px 1px rgba(255,255,255,0.05)'
                }}
              />
              <Search size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              {query && (
                <button onClick={handleClear} style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 4,
                  cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex'
                }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Small Stat Cards */}
          {[
            { label: 'Active Members', value: '50+', icon: Users, glow: 'rgba(59, 130, 246, 0.1)', textColor: '#60a5fa' },
            { label: 'Referrals Passed', value: '₹2Cr+', icon: TrendingUp, glow: 'rgba(34, 197, 94, 0.1)', textColor: '#4ade80' },
            { label: 'Years Active', value: '5+', icon: ShieldCheck, glow: 'rgba(168, 85, 247, 0.1)', textColor: '#c084fc' },
            { label: 'Categories', value: '40+', icon: ArrowRight, glow: 'rgba(249, 115, 22, 0.1)', textColor: '#fb923c' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + (i * 0.05) }}
              className="bento-stat bento-card"
              style={{
                padding: '24px', position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: 16, cursor: 'default'
              }}
            >
              <div className="stat-glow" style={{
                position: 'absolute', inset: 0, background: `linear-gradient(to bottom right, ${stat.glow}, transparent)`,
                opacity: 0.5, transition: 'opacity 0.5s'
              }} />
              
              <div style={{
                width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1
              }}>
                <stat.icon size={20} color="rgba(255,255,255,0.6)" />
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: stat.textColor }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>
      </div>

      <style>{`
        .custom-bento-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .bento-hero { grid-column: span 2; }
        .bento-search { grid-column: span 2; }
        .bento-stat { grid-column: span 1; }

        .bento-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
          transition: border-color 0.3s;
        }
        .bento-card:hover {
          border-color: rgba(255,255,255,0.1);
        }
        .bento-stat:hover .stat-glow {
          opacity: 1 !important;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(234, 179, 8, 0.8); }
          50% { opacity: 0.5; box-shadow: 0 0 2px rgba(234, 179, 8, 0.3); }
        }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }

        @media (min-width: 768px) {
          .custom-bento-grid {
            grid-template-columns: repeat(12, 1fr);
            gap: 24px;
          }
          .bento-hero { grid-column: span 8 !important; }
          .bento-search { grid-column: span 4 !important; }
          .bento-stat { grid-column: span 3 !important; }
        }
      `}</style>
    </section>
  )
}

