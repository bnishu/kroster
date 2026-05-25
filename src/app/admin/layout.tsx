import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090909', position: 'relative' }}>
      <AdminSidebar />
      <main 
        style={{
          flex: 1,
          padding: '40px 32px',
          maxWidth: '100%',
          minWidth: 0,
        }}
        className="w-full admin-main-container"
      >
        {children}
      </main>
      <style>{`
        .admin-main-container {
          padding-left: 24px !important;
        }
        @media (min-width: 768px) {
          .admin-main-container {
            padding-left: 264px !important; /* 232px sidebar width + 32px padding */
          }
        }
      `}</style>
    </div>
  )
}
