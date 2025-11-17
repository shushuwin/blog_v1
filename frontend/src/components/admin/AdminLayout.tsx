import AdminBar from './AdminBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminBar />
      <div className="py-6">
        {children}
      </div>
    </div>
  )
}