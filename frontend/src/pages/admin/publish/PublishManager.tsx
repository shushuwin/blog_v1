import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Link } from 'react-router-dom'

type Item = { id: number; kind: 'post' | 'life'; title: string; section: string; is_published: boolean; uploader_name?: string }

export default function PublishManager() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchAll() {
    setLoading(true)
    try {
      const r = await api.get('/api/admin/publish')
      setItems(r.data.items || [])
    } catch (e: any) {
      setError(e.response?.data?.detail || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  async function togglePublish(it: Item, next: boolean) {
    await api.put(`/api/admin/publish/${it.kind}/${it.id}/publish`, null, { params: { is_published: next } })
    await fetchAll()
  }

  async function remove(it: Item) {
    if (!confirm('确定删除？')) return
    await api.delete(`/api/admin/publish/${it.kind}/${it.id}`)
    setItems(items.filter(x => !(x.id === it.id && x.kind === it.kind)))
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-stone-900">发布管理</h1>
          <p className="text-stone-600">统一管理笔记分享与个人生活的发布</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="text-left px-4 py-3 text-stone-700">发布名称</th>
                <th className="text-left px-4 py-3 text-stone-700">发布板块</th>
                <th className="text-left px-4 py-3 text-stone-700">发布状态</th>
                <th className="text-left px-4 py-3 text-stone-700">功能：修改</th>
                <th className="text-left px-4 py-3 text-stone-700">功能：隐藏发布</th>
                <th className="text-left px-4 py-3 text-stone-700">功能：删除文章</th>
                <th className="text-left px-4 py-3 text-stone-700">发布者</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6" colSpan={7}>加载中...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="px-4 py-6 text-stone-600" colSpan={7}>暂无发布内容</td></tr>
              ) : (
                items.map(it => (
                  <tr key={`${it.kind}-${it.id}`} className="border-b border-stone-200">
                    <td className="px-4 py-3 text-stone-900">{it.title}</td>
                    <td className="px-4 py-3 text-stone-700">{it.section}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded ${it.is_published ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'}`}>{it.is_published ? '已发布' : '已隐藏'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {it.kind === 'post' ? (
                        <Link to={`/admin/posts/edit/${it.id}`} className="text-stone-900">修改</Link>
                      ) : (
                        <span className="text-stone-400">无</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublish(it, !it.is_published)} className="px-3 py-1 rounded bg-stone-200 text-stone-800 hover:bg-stone-300">
                        {it.is_published ? '隐藏' : '取消隐藏'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(it)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">删除</button>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{it.uploader_name || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}