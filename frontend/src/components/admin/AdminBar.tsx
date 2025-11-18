import { Link, useLocation } from 'react-router-dom'

export default function AdminBar() {
  const { pathname } = useLocation()
  const active = (p: string) => pathname.startsWith(p)
  return (
    <div className="sticky top-16 z-30 bg-stone-50/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-stone-900 font-semibold">后台管理面板</span>
          <Link to="/admin" className={`px-3 py-1 rounded ${active('/admin/posts') || pathname === '/admin' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>文章</Link>
          <Link to="/admin/import/markdown" className={`px-3 py-1 rounded ${active('/admin/import/markdown') ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>导入Markdown</Link>
          <Link to="/admin/posts/new" className={`px-3 py-1 rounded ${active('/admin/posts/new') ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>新建文章</Link>
          <Link to="/admin/projects" className={`px-3 py-1 rounded ${active('/admin/projects') ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>项目</Link>
          <Link to="/admin/users" className={`px-3 py-1 rounded ${active('/admin/users') ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>用户</Link>
          <Link to="/admin/settings" className={`px-3 py-1 rounded ${active('/admin/settings') ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>设置</Link>
        </div>
      </div>
    </div>
  )
}