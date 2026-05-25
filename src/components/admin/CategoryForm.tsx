'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createCategory, updateCategory } from '@/app/admin/actions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isVacant: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      isVacant: !!initialData.isVacant,
    } : { name: '', description: '', isVacant: false },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateCategory(initialData.id, data)
        toast.success('Category updated')
      } else {
        await createCategory(data)
        toast.success('Category created')
      }
      router.push('/admin/categories')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/80">Name</label>
          <input
            {...register('name')}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B]"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-white/80">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B]"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isVacant"
            {...register('isVacant')}
            style={{
              width: 16, height: 16, borderRadius: 4, cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <label htmlFor="isVacant" className="text-sm font-medium text-white/80 cursor-pointer select-none">
            Mark as Vacant Category (No active members, shown in vacant marquee)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')} className="bg-transparent border-white/10">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-[#B61F2B] hover:bg-[#7A111B] text-white">
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  )
}
