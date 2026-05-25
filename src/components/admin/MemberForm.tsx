'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createMember, updateMember } from '@/app/admin/actions'

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  businessName: z.string().min(1, 'Business name is required'),
  categoryId: z.string().optional(),
  memberRole: z.enum(['ED', 'SUPPORT', 'HEAD_TABLE', 'MEMBER']),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  shortIntro: z.string().optional(),
  fullDescription: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof schema>

import { toTitleCase } from '@/lib/utils'

export function MemberForm({ initialData, categories }: { initialData?: any, categories: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { 
      fullName: '', businessName: '', memberRole: 'MEMBER', isActive: true,
      phone: '', whatsapp: '', email: '', website: '', shortIntro: '', fullDescription: '', address: '', profileImage: ''
    },
  })

  const profileImage = watch('profileImage')
  const fullName = watch('fullName')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateMember(initialData.id, data)
        toast.success('Member updated')
      } else {
        await createMember(data)
        toast.success('Member created')
      }
      router.push('/admin/members')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 member-edit-form">
      {/* Top Section - Image & Basic Info */}
      <div className="form-row-layout">
        <div className="form-image-col">
          <ImageUpload
            name={fullName || 'member'}
            type="profile"
            label="Profile Image"
            value={profileImage}
            onChange={(url) => setValue('profileImage', url)}
          />
        </div>
        
        <div className="form-info-col">
          <div className="form-grid-2">
            <div>
              <label className="text-sm font-semibold text-white/80">Full Name</label>
              <input {...register('fullName')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-white/80">Business Name</label>
              <input {...register('businessName')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
              {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName.message}</p>}
            </div>
          </div>

          <div className="form-grid-2 mt-4">
            <div>
              <label className="text-sm font-semibold text-white/80">Category</label>
              <div style={{ position: 'relative' }}>
                <select {...register('categoryId')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#B61F2B] appearance-none form-select-style">
                  <option value="" className="bg-[#111]">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#111]">{toTitleCase(c.name)}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-30%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>▼</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-white/80">Role</label>
              <div style={{ position: 'relative' }}>
                <select {...register('memberRole')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#B61F2B] appearance-none form-select-style">
                  <option value="MEMBER" className="bg-[#111]">Member</option>
                  <option value="HEAD_TABLE" className="bg-[#111]">Head Table</option>
                  <option value="SUPPORT" className="bg-[#111]">Support Team</option>
                  <option value="ED" className="bg-[#111]">Executive Director</option>
                </select>
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-30%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>▼</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6 bg-white/[0.02] p-3 rounded-xl border border-white/5 w-fit">
            <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[#B61F2B] cursor-pointer" />
            <label htmlFor="isActive" className="text-sm font-semibold text-white/90 cursor-pointer select-none">Active Member Status</label>
          </div>
        </div>
      </div>

      <div className="form-sections-grid pt-8 border-t border-white/10">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }} />
            Contact Info
          </h3>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">Phone</label>
            <input {...register('phone')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">WhatsApp</label>
            <input {...register('whatsapp')} placeholder="+91..." className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">Email</label>
            <input {...register('email')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">Website</label>
            <input {...register('website')} placeholder="https://..." className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fb923c' }} />
            Profile Content
          </h3>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">Short Intro (Tagline)</label>
            <input {...register('shortIntro')} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#B61F2B] form-input-style" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">Full Description</label>
            <textarea {...register('fullDescription')} rows={4} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#B61F2B] form-input-style" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase">Address</label>
            <textarea {...register('address')} rows={2} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#B61F2B] form-input-style" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/members')} style={{ padding: '10px 24px', borderRadius: 10 }} className="bg-transparent border-white/10 text-white/60 hover:bg-white/5">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} style={{ padding: '10px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #B61F2B, #7A111B)' }} className="text-white hover:opacity-90">
          {isSubmitting ? 'Saving...' : 'Save Member'}
        </Button>
      </div>

      <style>{`
        .form-row-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-image-col {
          width: 100%;
        }
        .form-info-col {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .form-sections-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .form-input-style, .form-select-style {
          background-color: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          transition: all 0.22s ease !important;
        }
        .form-input-style:focus, .form-select-style:focus {
          background-color: rgba(255,255,255,0.07) !important;
          border-color: #B61F2B !important;
          box-shadow: 0 0 0 3px rgba(182,31,43,0.15) !important;
        }

        @media (min-width: 768px) {
          .form-row-layout {
            flex-direction: row;
            align-items: flex-start;
          }
          .form-image-col {
            width: 240px;
            flex-shrink: 0;
          }
          .form-info-col {
            flex: 1;
          }
          .form-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
          .form-sections-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </form>
  )
}
