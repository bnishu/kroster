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
  
  if (data.categoryId !== undefined) {
    if (data.categoryId) data.category = { connect: { id: data.categoryId } }
    delete data.categoryId
  }
  
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
  const session = await auth()
  const user = session?.user as any
  let isAdmin = false
  if (process.env.NODE_ENV === 'development' && (!user || user.id === 'dev-admin-id')) {
    isAdmin = true
  } else if (user?.role === 'ADMIN') {
    isAdmin = true
  }

  if (!isAdmin) {
    if (!user?.email) throw new Error('Unauthorized')
    const member = await prisma.member.findUnique({ where: { id }, select: { email: true } })
    if (!member || member.email !== user.email) {
      throw new Error('Unauthorized: You can only edit your own profile')
    }
    // Prevent non-admins from changing roles or active status
    delete data.memberRole
    delete data.teamRole
    delete data.isActive
    delete data.displayOrder
    delete data.categoryId
  }
  
  // Only update slug if fullName changed (for simplicity we can just update it)
  const slug = slugify(data.fullName)
  
  if (data.categoryId !== undefined) {
    if (data.categoryId) data.category = { connect: { id: data.categoryId } }
    else data.category = { disconnect: true }
    delete data.categoryId
  }
  
  // Find current member to preserve displayOrder if role is not changing
  const currentMember = await prisma.member.findUnique({ where: { id }, select: { memberRole: true, displayOrder: true } })
  const newRole = data.memberRole as MemberRole | undefined

  let updatedDisplayOrder = undefined
  if (newRole && currentMember) {
    if (newRole !== currentMember.memberRole) {
      updatedDisplayOrder = newRole === 'ED' ? 1 : newRole === 'SUPPORT' ? 2 : newRole === 'HEAD_TABLE' ? 3 : 10
    } else {
      updatedDisplayOrder = currentMember.displayOrder
    }
  }

  await prisma.member.update({
    where: { id },
    data: {
      ...data,
      slug,
      displayOrder: updatedDisplayOrder,
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
  let slug = slugify(data.title)
  const existing = await prisma.event.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now()}`
  }
  
  await prisma.event.create({
    data: { ...data, slug }
  })
  
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin/events')
}

export async function updateEvent(id: string, data: { title: string; description?: string; eventDate: Date; location?: string; image?: string; isPublished: boolean }) {
  await checkAdmin()
  const currentEvent = await prisma.event.findUnique({ where: { id } })
  if (!currentEvent) throw new Error('Event not found')

  let slug = slugify(data.title)
  if (slug !== currentEvent.slug) {
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }
  } else {
    slug = currentEvent.slug
  }
  
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
