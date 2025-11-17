import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'

type Project = { id: number; name: string }

export default function ProjectManager() {
  const [items, setItems] = useState<Project[]>([])
  useEffect(() => {
    api.get('/api/projects', { params: { page: 1, limit: 20 } }).then(r => setItems(r.data.items || []))
  }, [])
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">项目管理</h1>
        <div className="flex gap-2">
          <Link to="/admin" className="px-3 py-1 bg-gray-200 rounded">文章</Link>
          <Link to="/admin/projects" className="px-3 py-1 bg-primary text-white rounded">项目</Link>
          <Link to="/admin/files" className="px-3 py-1 bg-gray-200 rounded">文件</Link>
          <Link to="/admin/users" className="px-3 py-1 bg-gray-200 rounded">用户</Link>
          <Link to="/admin/settings" className="px-3 py-1 bg-gray-200 rounded">设置</Link>
          <Link to="/admin/projects/new" className="px-3 py-1 bg-primary text-white rounded">新建项目</Link>
        </div>
      </div>
      <div className="bg-white rounded shadow divide-y">
        {items.map(i => (
          <div key={i.id} className="p-4 flex items-center justify-between">
            <div className="font-medium">{i.name}</div>
            <Link to={`/admin/projects/edit/${i.id}`} className="text-primary">编辑</Link>
          </div>
        ))}
      </div>
    </div>
  )
}