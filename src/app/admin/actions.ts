'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { auth } from '@/lib/auth'
import type { MemberRole } from '@prisma/client'

// --- Auth Check Helper ---
async function checkAdmin() {
  const session = await auth()
  if (process.env.NODE_ENV === 'development') {
    return session?.user || { id: 'dev-admin-id', name: 'Dev Admin', email: 'dev-admin@bnikrypton.com', role: 'ADMIN' }
  }
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

// --- MEMBERS ---

export async function createMember(data: any) {
  await checkAdmin()
  const slug = slugify(data.fullName)
  
  await prisma.member.create({
    data: {
      ...data,
      slug,
      isActive: true,
      displayOrder: data.memberRole === 'ED' ? 1 : data.memberRole === 'SUPPORT' ? 2 : data.memberRole === 'HEAD_TABLE' ? 3 : 10,
    }
  })
  
  revalidatePath('/')
  revalidatePath('/admin/members')
}

export async function updateMember(id: string, data: any) {
  await checkAdmin()
  
  // Only update slug if fullName changed (for simplicity we can just update it)
  const slug = slugify(data.fullName)
  
  await prisma.member.update({
    where: { id },
    data: {
      ...data,
      slug,
      displayOrder: data.memberRole === 'ED' ? 1 : data.memberRole === 'SUPPORT' ? 2 : data.memberRole === 'HEAD_TABLE' ? 3 : 10,
    }
  })
  
  revalidatePath('/')
  revalidatePath(`/members/${slug}`)
  revalidatePath('/admin/members')
}

export async function deleteMember(id: string) {
  await checkAdmin()
  await prisma.member.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/members')
}

// --- CATEGORIES ---

export async function createCategory(data: { name: string; description?: string; isVacant?: boolean }) {
  await checkAdmin()
  const slug = slugify(data.name)
  
  await prisma.category.create({
    data: { ...data, slug }
  })
  
  revalidatePath('/')
  revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, data: { name: string; description?: string; isVacant?: boolean }) {
  await checkAdmin()
  const slug = slugify(data.name)
  
  await prisma.category.update({
    where: { id },
    data: { ...data, slug }
  })
  
  revalidatePath('/')
  revalidatePath('/admin/categories')
}

export async function toggleCategoryVacant(id: string, isVacant: boolean) {
  await checkAdmin()
  await prisma.category.update({
    where: { id },
    data: { isVacant }
  })
  revalidatePath('/')
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  await prisma.category.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/categories')
}

// --- EVENTS ---

export async function createEvent(data: { title: string; description?: string; eventDate: Date; location?: string; image?: string; isPublished: boolean }) {
  await checkAdmin()
  const slug = slugify(data.title)
  
  await prisma.event.create({
    data: { ...data, slug }
  })
  
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin/events')
}

export async function updateEvent(id: string, data: { title: string; description?: string; eventDate: Date; location?: string; image?: string; isPublished: boolean }) {
  await checkAdmin()
  const slug = slugify(data.title)
  
  await prisma.event.update({
    where: { id },
    data: { ...data, slug }
  })
  
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin/events')
}

export async function deleteEvent(id: string) {
  await checkAdmin()
  await prisma.event.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin/events')
}

export async function updateSettings(settings: Record<string, string>) {
  await checkAdmin()
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
  }
  revalidatePath('/')
}
