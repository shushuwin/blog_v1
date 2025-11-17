import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Link } from 'react-router-dom'

type Post = { id: number; title: string; is_published: boolean }

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([])
  useEffect(() => {
    api.get('/api/posts', { params: { page: 1, limit: 20 } }).then(r => setPosts(r.data.items || []))
  }, [])
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-stone-900">文章管理</h1>
        </div>
        <div className="bg-white rounded-lg shadow divide-y">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-stone-600">暂无文章</div>
          ) : (
            posts.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div className="font-medium text-stone-900">{p.title}</div>
                <div className="text-sm text-stone-600">{p.is_published ? '已发布' : '草稿'}</div>
                <div className="flex gap-2">
                  <Link to={`/admin/posts/edit/${p.id}`} className="text-stone-900">编辑</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}