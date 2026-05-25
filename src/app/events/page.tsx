import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Meetings | BNI Krypton',
  description: 'Upcoming BNI Krypton chapter meetings, networking events, and business workshops in Nagpur.',
}

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true, eventDate: { gte: new Date() } },
    orderBy: { eventDate: 'asc' },
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24">
        <div className="container-main">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-['Playfair_Display'] mb-4">
              Upcoming Events
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Join us for our weekly chapter meetings and exclusive networking events to grow your business connections.
            </p>
          </div>

          {/* Events List */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="glass rounded-3xl overflow-hidden border border-white/10 group flex flex-col hover:border-white/20 transition-colors">
                  {event.image ? (
                    <div className="relative h-48 w-full bg-white/5 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="glass px-3 py-1.5 rounded-lg text-xs font-semibold text-white backdrop-blur-md border border-white/20 flex flex-col items-center justify-center min-w-[50px]">
                          <span className="text-[#B61F2B] text-lg leading-none">{event.eventDate.getDate()}</span>
                          <span className="uppercase text-[10px] mt-0.5">{event.eventDate.toLocaleString('en-US', { month: 'short' })}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="p-6 flex flex-col flex-1">
                    {!event.image && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 8,
                          padding: '4px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <span style={{ color: '#B61F2B', fontWeight: 800, fontSize: 13 }}>
                            {event.eventDate.getDate()}
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                            {event.eventDate.toLocaleString('en-US', { month: 'short' })}
                          </span>
                        </div>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2 font-['Playfair_Display'] group-hover:text-[#D4AF37] transition-colors">{event.title}</h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Calendar className="w-4 h-4 text-[#B61F2B]" />
                        {formatEventDate(event.eventDate)}
                      </div>
                      {event.location && (
                        <div className="flex items-start gap-2 text-white/50 text-sm">
                          <MapPin className="w-4 h-4 text-[#B61F2B] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-white/60 text-sm mb-6 line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#D4AF37] transition-colors group/btn">
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl border border-white/10 max-w-2xl mx-auto">
              <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Events</h3>
              <p className="text-white/50">Check back later for newly scheduled chapter meetings and networking events.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
