'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const result = await signIn('nodemailer', {
        email,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        setError('Failed to send login email. Please try again.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090909',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradients */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(182,31,43,0.12) 0%, rgba(212,175,55,0.02) 50%, #090909 100%)',
          zIndex: 1,
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          height: 450,
          borderRadius: '50%',
          backgroundColor: 'rgba(212,175,55,0.06)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 420,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #B61F2B 0%, #6e0f19 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(182,31,43,0.4)',
              position: 'relative',
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, fontFamily: '"Playfair Display", serif' }}>BNI</span>
              <div style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: '50%',
                background: '#D4AF37', border: '2px solid #090909',
              }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: 16, lineHeight: 1.2 }}>BNI Krypton</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 1 }}>Member Portal</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 24,
            padding: 40,
            border: '1px solid rgba(212,175,55,0.15)', // Premium gold glow borders
            boxShadow: '0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 30px rgba(212,175,55,0.04)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gold shine overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 50%)',
            pointerEvents: 'none',
          }} />

          {!sent ? (
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h1 style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#ffffff',
                textAlign: 'center',
                marginBottom: 6,
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: '-0.01em',
              }}>
                Welcome Back
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13, marginBottom: 32 }}>
                Enter your email to receive a secure login link.
              </p>

              {error && (
                <div style={{
                  marginBottom: 20,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                  fontSize: 13,
                  textAlign: 'center',
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ position: 'relative' }}>
                  <Mail style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 18,
                    height: 18,
                    color: 'rgba(255, 255, 255, 0.35)',
                    pointerEvents: 'none',
                  }} />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      width: '100%',
                      height: 48,
                      paddingLeft: 46,
                      paddingRight: 16,
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all 0.22s ease',
                    }}
                    className="focus:border-[#B61F2B] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#B61F2B]/15 text-white"
                    aria-label="Email address"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  style={{
                    width: '100%',
                    height: 48,
                    background: 'linear-gradient(135deg, #B61F2B 0%, #7A111B 100%)',
                    border: 'none',
                    borderRadius: 12,
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(182, 31, 43, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.18s ease',
                  }}
                  className="hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Sending...</>
                  ) : (
                    <>Send Login Link <ArrowRight style={{ width: 14, height: 14 }} /></>
                  )}
                </Button>
              </form>

              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 24, fontWeight: 500 }}>
                No password needed. We&apos;ll send you a secure link.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0', position: 'relative', zIndex: 10 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                backgroundColor: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                <Mail style={{ width: 28, height: 28, color: '#4ade80' }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: '"Playfair Display", serif' }}>Check Your Email</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}>
                We&apos;ve sent a login link to <span style={{ color: '#fff', fontWeight: 600 }}>{email}</span>.<br/>
                Click the link in your email to sign in.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  marginTop: 32,
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  paddingBottom: 2,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link 
            href="/" 
            style={{ 
              color: 'rgba(255,255,255,0.4)', 
              fontSize: 13, 
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            &larr; Back to directory
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
