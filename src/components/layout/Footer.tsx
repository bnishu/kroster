import Link from 'next/link'
import { Mail, MapPin, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <>


      <footer style={{
        background: '#0D0D0D',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div className="container-main" style={{ padding: '64px 24px 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          gap: 40,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, #B61F2B, #6e0f19)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(182,31,43,0.40)',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 11, fontFamily: '"Playfair Display", serif' }}>BNI</span>
              </div>
              <div>
                <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: 14 }}>BNI Krypton</div>
                <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Business Network</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.7 }}>
              Nagpur&apos;s premier business networking chapter. Building lasting relationships and
              driving growth through referrals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)', marginBottom: 14,
            }}>
              Quick Links
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, listStyle: 'none' }}>
              {[
                { href: '/#members', label: 'Browse Members' },
                { href: '/#events',  label: 'Upcoming Events' },
                { href: '/login',    label: 'Member Login' },
                { href: '/admin',    label: 'Admin Panel' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="footer-link" style={{
                    color: 'rgba(255,255,255,0.40)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
                  }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)', marginBottom: 14,
            }}>
              Contact
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: 10 }}>
                <MapPin size={14} style={{ color: '#B61F2B', flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, lineHeight: 1.55 }}>
                  Nagpur, Maharashtra, India
                </span>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <Mail size={14} style={{ color: '#B61F2B', flexShrink: 0, marginTop: 1 }} />
                <a href="mailto:krypton@bni.com" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.40)', fontSize: 13, textDecoration: 'none',
                }}>
                  krypton@bni.com
                </a>
              </li>
            </ul>
          </div>

          {/* Chapter */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)', marginBottom: 14,
            }}>
              Chapter
            </div>
            <a
              href="https://bni-nagpur.in/en-IN/chapterdetail?chapterId=7QKJvFtIdz9xPf8f9ZWHIg%3D%3D&name=BNI%20Krypton"
              target="_blank" rel="noopener noreferrer"
              className="footer-chapter-link"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 14px', borderRadius: 9,
                background: 'rgba(182,31,43,0.08)', border: '1px solid rgba(182,31,43,0.18)',
                color: '#B61F2B', fontSize: 12, fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={12} /> View BNI Page
            </a>
            <p style={{ color: 'rgba(255,255,255,0.20)', fontSize: 11, marginTop: 12, lineHeight: 1.6 }}>
              BNI® — Business Network International.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>
            © {new Date().getFullYear()} BNI Krypton Chapter. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/privacy" className="footer-link" style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms"   className="footer-link" style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
