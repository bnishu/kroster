import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = formatPhone(phone)
  const msg = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${cleaned}${msg ? `?text=${msg}` : ''}`
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getMemberRoleLabel(role: string, name?: string): string {
  if (role === 'HEAD_TABLE' && name) {
    const n = name.toLowerCase()
    if (n.includes('aliakbbar') && n.includes('maimun')) return 'President'
    if (n.includes('pratik') && n.includes('bhosale')) return 'Vice President'
    if (n.includes('jitendra') && n.includes('roy')) return 'Secretary / Treasurer'
    if (n.includes('khushboo') && n.includes('murarka')) return 'Lead Visitor Host'
  }
  if (role === 'SUPPORT' && name) {
    const n = name.toLowerCase()
    if (n.includes('mufazzal') && n.includes('fidvi')) return 'Chapter Area Director Consultant'
    if (n.includes('abhishek') && n.includes('dhakate')) return 'Chapter Director Consultant'
    if (n.includes('binal') && n.includes('vaidya')) return 'Chapter Ambassador'
  }
  const labels: Record<string, string> = {
    ED: 'Executive Director',
    SUPPORT: 'Support Team',
    HEAD_TABLE: 'Head Table',
    MEMBER: 'Member',
  }
  return labels[role] ?? role
}

export function toTitleCase(str: string): string {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

