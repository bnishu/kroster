import { prisma } from './prisma'

export async function ensureUpcomingTuesdayMeetings() {
  try {
    const today = new Date()
    
    // We will auto-generate up to 8 upcoming Tuesdays
    for (let i = 1; i <= 8; i++) {
      const targetDate = new Date(today)
      const day = targetDate.getDay()
      
      // Calculate days to next Tuesday
      let daysToTuesday = (2 - day + 7) % 7
      
      if (daysToTuesday === 0) {
        // If today is Tuesday, include today (for i = 1) or i weeks out
        daysToTuesday = 7 * (i - 1)
      } else {
        daysToTuesday = daysToTuesday + 7 * (i - 1)
      }
      
      targetDate.setDate(targetDate.getDate() + daysToTuesday)
      targetDate.setHours(7, 30, 0, 0)
      
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      // Check if an event already exists on this date
      const existing = await prisma.event.findFirst({
        where: {
          eventDate: {
            gte: startOfDay,
            lte: endOfDay,
          }
        }
      })
      
      if (!existing) {
        const dateStr = targetDate.toISOString().split('T')[0]
        const slug = `weekly-meeting-${dateStr}`
        
        await prisma.event.create({
          data: {
            title: 'Weekly Business Conclave — BNI Krypton',
            slug,
            description: "Join BNI Krypton's weekly networking meeting to pitch your business, swap high-quality referrals, and collaborate with Nagpur's elite business professionals.",
            eventDate: targetDate,
            location: 'Hotel Centre Point, Ramdaspeth, Nagpur',
            isPublished: true,
          }
        })
        console.log(`Automatically added upcoming Tuesday meeting for ${dateStr}`)
      }
    }
  } catch (err) {
    console.error('Error auto-creating upcoming events:', err)
  }
}
