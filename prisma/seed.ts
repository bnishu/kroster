import { PrismaClient, MemberRole } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'
import * as path from 'path'
import * as fs from 'fs'
import * as XLSX from 'xlsx'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'kroster',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

// Reusable slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, '') // Trim - from end
}

// Clean phone and whatsapp numbers
function cleanPhoneNumber(numStr: any): { phone: string; whatsapp: string } {
  if (!numStr) return { phone: '', whatsapp: '' }
  
  const digits = String(numStr).replace(/[^0-9]/g, '')
  
  let cleaned = digits
  // If it's a 10 digit Indian number without country code
  if (digits.length === 10) {
    cleaned = '91' + digits
  } else if (digits.length === 12 && digits.startsWith('91')) {
    cleaned = digits
  }
  
  const displayPhone = cleaned.startsWith('91') && cleaned.length === 12
    ? `+91-${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
    : `+${cleaned}`
    
  return {
    phone: displayPhone,
    whatsapp: cleaned
  }
}

// Format website URLs safely
function formatWebsite(web: any): string | null {
  if (!web) return null
  const w = String(web).trim()
  const lower = w.toLowerCase()
  if (lower === 'no' || lower === 'na' || lower === 'coming soon' || lower === 'working' || lower === '') {
    return null
  }
  if (!w.startsWith('http://') && !w.startsWith('https://')) {
    return `https://${w}`
  }
  return w
}

async function main() {
  console.log('Starting BNI Krypton Actual Roster Seeding...')

  // Step 0: Clear all existing categories, members, testimonials and analytics
  console.log('Clearing old database records...')
  await prisma.memberAnalytics.deleteMany({})
  await prisma.testimonial.deleteMany({})
  await prisma.member.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.event.deleteMany({})

  // Step 1: Read the excel sheet
  const excelPath = path.join(process.cwd(), 'GOOGLE FORM FOR ROSTER.xlsx')
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Excel file not found at: ${excelPath}`)
  }

  const workbook = XLSX.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const excelData = XLSX.utils.sheet_to_json(sheet) as any[]

  console.log(`Successfully parsed Excel. Found ${excelData.length} records.`)

  // Step 2: Seed Regional & Support leadership manually (not in Excel sheet)
  const manualMembers = [
    // EDs (Regional Directors)
    {
      fullName: 'Bhaveshh Tahalramani',
      slug: 'bhaveshh-tahalramani',
      businessName: 'BNI Nagpur',
      categoryName: 'Business Development',
      phone: '+91-98765-43210',
      whatsapp: '919876543210',
      email: 'bhavesh@bninagpur.com',
      shortIntro: 'Executive Director of BNI Nagpur, empowering local businesses to grow through structured, professional referral marketing.',
      fullDescription: 'Bhaveshh Tahalramani is the Executive Director of BNI Nagpur. Under his leadership, Nagpur has witnessed massive business referral growth, bridging the gap between local enterprise and regional networking opportunities.',
      memberRole: MemberRole.ED,
      displayOrder: 1,
      featured: true,
    },
    {
      fullName: 'Riddhi Saboo Tahalramani',
      slug: 'riddhi-saboo-tahalramani',
      businessName: 'BNI Nagpur',
      categoryName: 'Business Consulting',
      phone: '+91-98765-43211',
      whatsapp: '919876543211',
      email: 'riddhi@bninagpur.com',
      shortIntro: 'Executive Director of BNI Nagpur, fostering business leadership, collaboration, and networking excellence.',
      fullDescription: 'Riddhi Saboo Tahalramani co-leads BNI Nagpur as Executive Director, spearheading training, chapter mentorship, and business development across Nagpur\'s elite business network.',
      memberRole: MemberRole.ED,
      displayOrder: 2,
      featured: true,
    },
    // Supports (Chapter Consultant / Director / Area Director / Ambassador)
    {
      fullName: 'Abhishek Dhakate',
      slug: 'abhishek-dhakate',
      businessName: 'AD Photography',
      categoryName: 'Photography',
      phone: '+91-98765-43212',
      whatsapp: '919876543212',
      email: 'abhishek@adphotography.in',
      shortIntro: 'Chapter Director Consultant for BNI Krypton. Leading photography and visual brand consultant.',
      fullDescription: 'Abhishek Dhakate serves as the Chapter Director Consultant for BNI Krypton. His dedication helps structure meetings, monitor chapter health, and consult members on chapter policies.',
      memberRole: MemberRole.SUPPORT,
      displayOrder: 1,
      featured: false,
    },
    {
      fullName: 'Mufazzal Fidvi',
      slug: 'mufazzal-fidvi',
      businessName: 'Fidvi Consultants',
      categoryName: 'Business Management',
      phone: '+91-98765-43213',
      whatsapp: '919876543213',
      email: 'mufazzal@fidviconsultants.com',
      shortIntro: 'Chapter Area Director Consultant. Supporting business scalability and leadership development.',
      fullDescription: 'Mufazzal Fidvi is the Area Director Consultant. He brings immense business growth experience, guiding chapter leaders and ensuring strategic collaboration within BNI.',
      memberRole: MemberRole.SUPPORT,
      displayOrder: 2,
      featured: false,
    },
    {
      fullName: 'Binal Vaidya',
      slug: 'binal-vaidya',
      businessName: 'BNI Krypton',
      categoryName: 'Business Networking',
      phone: '+91-98765-43214',
      whatsapp: '919876543214',
      email: 'binal@bnikrypton.com',
      shortIntro: 'Chapter Ambassador. Helping BNI Krypton members maximize their referral networking success.',
      fullDescription: 'Binal Vaidya acts as the Chapter Ambassador for BNI Krypton, facilitating training sessions and mentoring members to fully utilize the power of BNI network.',
      memberRole: MemberRole.SUPPORT,
      displayOrder: 3,
      featured: false,
    },
  ]

  // Create Categories set
  const categoriesSet = new Set<string>()
  excelData.forEach((row) => {
    if (row['CATEGORY ( AS PER BNI)']) {
      const cat = String(row['CATEGORY ( AS PER BNI)']).trim()
      if (cat.toLowerCase() !== 'sneha') {
        categoriesSet.add(cat)
      }
    }
  })
  // Add manual categories
  manualMembers.forEach((m) => {
    if (m.categoryName.toLowerCase() !== 'sneha') {
      categoriesSet.add(m.categoryName)
    }
  })

  console.log(`Identified ${categoriesSet.size} unique categories. Seeding them...`)

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

  // Step 3: Seed Categories
  const categoryIdMap: Record<string, string> = {}
  for (const catName of categoriesSet) {
    const slug = slugify(catName)
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name: catName, isVacant: false },
      create: {
        name: catName,
        slug,
        icon: catName.slice(0, 3).toUpperCase(),
        color: '#B61F2B',
        isVacant: false,
      },
    })
    categoryIdMap[catName] = category.id
  }

  console.log('Seeding vacant categories...')
  for (const catName of VACANT_CATEGORIES) {
    const slug = slugify(catName)
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name: catName, isVacant: true },
      create: {
        name: catName,
        slug,
        icon: catName.slice(0, 3).toUpperCase(),
        color: '#B61F2B',
        isVacant: true,
      },
    })
    categoryIdMap[catName] = category.id
  }

  console.log('Categories seeded successfully!')

  // Step 4: Seed manual members (EDs and Supports)
  for (const m of manualMembers) {
    const { categoryName, ...memberData } = m
    await prisma.member.upsert({
      where: { slug: memberData.slug },
      update: {
        fullName: memberData.fullName,
        businessName: memberData.businessName,
        categoryId: categoryIdMap[categoryName],
        phone: memberData.phone,
        whatsapp: memberData.whatsapp,
        email: memberData.email,
        shortIntro: memberData.shortIntro,
        fullDescription: memberData.fullDescription,
        memberRole: memberData.memberRole,
        displayOrder: memberData.displayOrder,
        featured: memberData.featured,
        isActive: true,
      },
      create: {
        fullName: memberData.fullName,
        slug: memberData.slug,
        businessName: memberData.businessName,
        categoryId: categoryIdMap[categoryName],
        phone: memberData.phone,
        whatsapp: memberData.whatsapp,
        email: memberData.email,
        shortIntro: memberData.shortIntro,
        fullDescription: memberData.fullDescription,
        memberRole: memberData.memberRole,
        displayOrder: memberData.displayOrder,
        featured: memberData.featured,
        isActive: true,
      },
    })
  }
  console.log('EDs and Support members seeded successfully!')

  // Step 5: Seed Excel members
  let excelSeededCount = 0
  for (const row of excelData) {
    const name = String(row['NAME'] || '').trim()
    if (!name) continue

    const businessName = String(row['BUSINESS NAME'] || '').trim()
    const catName = String(row['CATEGORY ( AS PER BNI)'] || '').trim()
    const rawWhatsapp = row['WHATSAPP NUMBER']
    const whatIDo = String(row['WHAT I DO? IN THREE LINES'] || '').trim()
    const website = formatWebsite(row['WEBSITE'])
    const address = String(row['BUSINESS ADDRESS'] || '').trim()
    const colOrder = Number(row['Column1'] || 999)

    const slug = slugify(name)
    const { phone, whatsapp } = cleanPhoneNumber(rawWhatsapp)

    // Leadership mapping based on corrected instructions:
    // Head Table (4 members):
    // 1. Aliakbbar Maimun (Doc Aliakbbar Maimun) -> HEAD_TABLE, order 1
    // 2. Pratik Bhosale (PRATIK JAISING BHOSALE) -> HEAD_TABLE, order 2
    // 3. Jitendra Roy (Jitendra roy) -> HEAD_TABLE, order 3
    // 4. Dr. Khushboo Murarka (Dr Khushboo Manan Murarka) -> HEAD_TABLE, order 4
    
    let role: MemberRole = MemberRole.MEMBER
    let order = colOrder
    let shortIntro = whatIDo === '*' ? `Verified BNI Krypton professional in the ${catName} category.` : whatIDo
    
    const nameLower = name.toLowerCase()
    
    if (nameLower.includes('aliakbbar') && nameLower.includes('maimun')) {
      role = MemberRole.HEAD_TABLE
      order = 1
      shortIntro = 'President of BNI Krypton Nagpur. Experienced Business Coach guiding premium corporate leadership and executive strategy.'
    } else if (nameLower.includes('pratik') && nameLower.includes('bhosale')) {
      role = MemberRole.HEAD_TABLE
      order = 2
      shortIntro = 'Vice President of BNI Krypton Nagpur. Leading Facade Contractor providing high-end structural facades and engineering solutions.'
    } else if (nameLower.includes('jitendra') && nameLower.includes('roy')) {
      role = MemberRole.HEAD_TABLE
      order = 3
      shortIntro = 'Secretary / Treasurer of BNI Krypton Nagpur. Owner of Nagpur Pest Management, delivering certified premium hygiene and pest services.'
    } else if (nameLower.includes('khushboo') && nameLower.includes('murarka')) {
      role = MemberRole.HEAD_TABLE
      order = 4
      shortIntro = 'Lead Visitor Host of BNI Krypton Nagpur. Renowned Homoeopath providing elite health and holistic wellness solutions.'
    }

    const profileImage = slug === 'nishant-barde' ? '/uploads/nishant-barde.avif' : null

    await prisma.member.upsert({
      where: { slug },
      update: {
        fullName: name,
        businessName,
        categoryId: categoryIdMap[catName] || null,
        phone,
        whatsapp,
        email: slug + '@bnikrypton.com', // fallback mock email based on slug
        website,
        shortIntro,
        fullDescription: shortIntro,
        address: address || null,
        displayOrder: order,
        memberRole: role,
        profileImage,
        isActive: true,
      },
      create: {
        fullName: name,
        slug,
        businessName,
        categoryId: categoryIdMap[catName] || null,
        phone,
        whatsapp,
        email: slug + '@bnikrypton.com',
        website,
        shortIntro,
        fullDescription: shortIntro,
        address: address || null,
        displayOrder: order,
        memberRole: role,
        profileImage,
        isActive: true,
      },
    })
    excelSeededCount++
  }

  console.log(`Successfully seeded ${excelSeededCount} members from the Excel sheet!`)

  // Step 6: Seed standard events
  const events = [
    {
      title: 'BNI Krypton Weekly Chapter Meeting',
      slug: 'weekly-meeting-june-2026',
      description: 'Join Nagpur\'s elite business network chapter for our highly structured and productive weekly meeting. Exchange quality business referrals, meet new professional partners, and scale your business.',
      eventDate: new Date('2026-06-04T07:30:00'),
      location: 'M2 Square, Sadar, Nagpur',
      isPublished: true,
    },
    {
      title: '🎤 BizTalk Show — BNI Krypton Tuesday Meeting',
      slug: 'biztalk-show-may-2026',
      description: 'An extraordinary networking experience! BNI Krypton presents the high-impact BizTalk Show. We are honored to host our prominent special guest speakers:\n\n' +
        '• Mr. Dilip Kamdar\n' +
        '• Mr. Mithilesh Wazalwar\n\n' +
        'Gain exclusive business insights, witness professional keynote showcases, and network with Nagpur\'s premier business network.',
      eventDate: new Date('2026-05-26T07:30:00'),
      location: 'Hotel Centre Point, Ramdaspeth, Nagpur',
      isPublished: true,
    },
    {
      title: '🏆 300th Landmark Weekly Meeting — BNI Krypton',
      slug: '300th-milestone-meeting',
      description: 'A momentous milestone! Celebrate our 300th weekly chapter meeting of BNI Krypton. Witness premium networking, special leadership keynotes, and massive business opportunities with Nagpur\'s leading business network.',
      eventDate: new Date('2026-06-02T07:30:00'),
      location: 'Hotel Centre Point, Ramdaspeth, Nagpur',
      isPublished: true,
    },
    {
      title: 'Weekly Business Conclave — BNI Krypton',
      slug: 'weekly-meeting-2026-06-09',
      description: 'Join BNI Krypton\'s weekly networking meeting to pitch your business, swap high-quality referrals, and collaborate with Nagpur\'s elite business professionals.',
      eventDate: new Date('2026-06-09T07:30:00'),
      location: 'Hotel Centre Point, Ramdaspeth, Nagpur',
      isPublished: true,
    },
    {
      title: '🚀 Focus Visitors Day (FVD) — BNI Krypton',
      slug: 'focus-visitors-day-2026',
      description: 'Grow your business exponentially! BNI Krypton is hosting its mega Focus Visitors Day. A high-energy referral day custom-tailored for selected key industries to showcase and connect. Special invitations for:\n\n' + 
        '• Real Estate: Architects (Commercial/Residential/Landscape), PEB Shed, HVAC Consultant, Civil Lawyers, CCTV, Housekeeping, Water Purifiers\n' +
        '• Automobile & Transport: Tyre/Accessories Dealers, Taxi Services, Logistics\n' +
        '• Health & Wellness: Gynaecologists, Cardiologists, Pediatricians, Nutritionists, Gym Owners\n' +
        '• Events & Lifestyle: Bakers, Banquets, Wedding/Event Planners, Cafés, Graphic Designers, Printing\n' +
        '• Business Services: Company Secretaries, Manpower Consultants, Grocery Merchants, Stationery, White Goods Dealers.',
      eventDate: new Date('2026-06-16T07:30:00'),
      location: 'Hotel Centre Point, Ramdaspeth, Nagpur',
      isPublished: true,
    },
    {
      title: 'Weekly Business Conclave — BNI Krypton',
      slug: 'weekly-meeting-2026-06-23',
      description: 'Join BNI Krypton\'s weekly networking meeting to pitch your business, swap high-quality referrals, and collaborate with Nagpur\'s elite business professionals.',
      eventDate: new Date('2026-06-23T07:30:00'),
      location: 'Hotel Centre Point, Ramdaspeth, Nagpur',
      isPublished: true,
    },
  ]

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    })
  }
  console.log('Events seeded successfully!')

  // Step 7: Chapter settings
  await prisma.setting.upsert({
    where: { key: 'chapter_name' },
    update: { value: 'BNI Krypton' },
    create: { key: 'chapter_name', value: 'BNI Krypton' },
  })
  await prisma.setting.upsert({
    where: { key: 'chapter_city' },
    update: { value: 'Nagpur' },
    create: { key: 'chapter_city', value: 'Nagpur' },
  })

  console.log('Chapter settings seeded successfully!')
  console.log('Roster seed process completed with absolute success!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
