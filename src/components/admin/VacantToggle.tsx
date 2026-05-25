'use client'

import { useState } from 'react'
import { toggleCategoryVacant } from '@/app/admin/actions'
import { toast } from 'sonner'

interface VacantToggleProps {
  id: string
  initialValue: boolean
}

export function VacantToggle({ id, initialValue }: VacantToggleProps) {
  const [checked, setChecked] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked
    setChecked(val)
    setLoading(true)
    try {
      await toggleCategoryVacant(id, val)
      toast.success(val ? 'Category marked as vacant' : 'Category marked as active')
    } catch {
      toast.error('Failed to update category status')
      setChecked(!val) // Revert state on failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={loading}
      onChange={handleChange}
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        cursor: loading ? 'not-allowed' : 'pointer',
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        opacity: loading ? 0.5 : 1,
        accentColor: '#B61F2B',
      }}
    />
  )
}
