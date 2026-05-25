'use client'

import { toTitleCase } from '@/lib/utils'
import { Tag } from 'lucide-react'

const VACANT_CATEGORIES = [
  'Architect – Commercial',
  'Architect – Residential',
  'Architect – Landscape',
  'PEB Shed',
  'HVAC Consultant',
  'Civil Lawyer',
  'CCTV & Security Systems',
  'Housekeeping Services',
  'Water Purifier Dealer',
  'Cold Storage',
  'Car Accessories Dealer',
  'Tyre Dealer',
  'Taxi Services',
  'Courier & Logistics',
  'Gynaecologist',
  'Heart Surgeon / Cardiologist',
  'Pediatrician',
  'Nutritionist',
  'Gym Owner',
  'Baker',
  'Banquet',
  'Event Planner – Wedding & Personal Events',
  'Café Shop',
  'Perfumes',
  'Graphic Designer',
  'Printing Services',
  'Company Secretary',
  'Manpower Consultant',
  'Grocery Merchant',
  'Mobile Retailer',
  'Stationery Supplier',
  'White Goods Dealer'
]

// Split categories into two rows for alternate direction marquees
export function VacantCategories({ categories }: { categories?: string[] }) {
  const list = categories && categories.length > 0 ? categories : VACANT_CATEGORIES
  const mid = Math.ceil(list.length / 2)
  const ROW_1 = list.slice(0, mid)
  const ROW_2 = list.slice(mid)
  return (
    <section 
      style={{
        padding: '96px 0 64px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: '#090909',
      }}
    >
      {/* Glow elements */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(182,31,43,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-main" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#B61F2B',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B61F2B' }} />
            Grow Our Network
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 38px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: '"Playfair Display", serif',
            marginBottom: 16,
          }}>
            Vacant Business Categories
          </h2>
          <p style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.45)',
            maxWidth: 550,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            We are actively seeking elite professionals in these specific sectors to join BNI Krypton Nagpur. Lock out your competitors and claim your exclusive seat!
          </p>
        </div>

        {/* Marquee Row 1 (Left Scrolling) */}
        <div className="marquee-wrapper">
          <div className="marquee-content marquee-left">
            {/* Direct list */}
            {ROW_1.map((cat) => (
              <div key={`r1-${cat}`} className="marquee-badge">
                <Tag size={13} style={{ color: '#B61F2B', flexShrink: 0 }} />
                <span>{toTitleCase(cat)}</span>
              </div>
            ))}
            {/* Duplicated for seamless loop */}
            {ROW_1.map((cat) => (
              <div key={`r1-dup-${cat}`} className="marquee-badge">
                <Tag size={13} style={{ color: '#B61F2B', flexShrink: 0 }} />
                <span>{toTitleCase(cat)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Right Scrolling) */}
        <div className="marquee-wrapper" style={{ marginTop: 16 }}>
          <div className="marquee-content marquee-right">
            {/* Direct list */}
            {ROW_2.map((cat) => (
              <div key={`r2-${cat}`} className="marquee-badge">
                <Tag size={13} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>{toTitleCase(cat)}</span>
              </div>
            ))}
            {/* Duplicated for seamless loop */}
            {ROW_2.map((cat) => (
              <div key={`r2-dup-${cat}`} className="marquee-badge">
                <Tag size={13} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <span>{toTitleCase(cat)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .marquee-wrapper {
          display: flex;
          overflow: hidden;
          user-select: none;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
        }
        .marquee-content {
          display: flex;
          gap: 16px;
          flex-shrink: 0;
          min-width: 100%;
        }
        .marquee-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.75);
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .marquee-badge:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: translateY(-1px);
        }
        
        .marquee-left {
          animation: scrollLeft 35s linear infinite;
        }
        .marquee-left:hover {
          animation-play-state: paused;
        }

        .marquee-right {
          animation: scrollRight 35s linear infinite;
        }
        .marquee-right:hover {
          animation-play-state: paused;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
