import { prisma } from './src/lib/prisma'

async function main() {
  const events = await prisma.event.findMany({
    where: {
      eventDate: {
        gte: new Date('2026-06-15T00:00:00Z'),
        lt: new Date('2026-06-17T00:00:00Z')
      }
    }
  })
  
  for (const event of events) {
    console.log(`Found event: ${event.title} on ${event.eventDate}`)
    
    if (event.description) {
      // Find the text to remove
      const textToRemove = `Special invitations for:

• Real Estate: Architects (Commercial/Residential/Landscape), PEB Shed, HVAC Consultant, Civil Lawyers, CCTV, Housekeeping, Water Purifiers
• Automobile & Transport: Tyre/Accessories Dealers, Taxi Services, Logistics
• Health & Wellness: Gynaecologists, Cardiologists, Pediatricians, Nutritionists, Gym Owners
• Events & Lifestyle: Bakers, Banquets, Wedding/Event Planners, Cafés, Graphic Designers, Printing
• Business Services: Company Secretaries, Manpower Consultants, Grocery Merchants, Stationery, White Goods Dealers.`;
      
      let newDescription = event.description.replace(textToRemove, '').trim();
      
      await prisma.event.update({
        where: { id: event.id },
        data: { description: newDescription }
      })
      console.log('Event updated successfully!')
    }
  }
}

main().catch(console.error)
