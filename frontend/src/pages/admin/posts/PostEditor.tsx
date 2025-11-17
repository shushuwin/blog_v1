import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/services/api'

type Mode = 'new' | 'edit'

export default function PostEditor({ mode }: { mode: Mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [isPublished, setIsPublished] = useState(true)
  const [isProtected, setIsProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [content, setContent] = useState('')
  const [cats, setCats] = useState<Array<{id:number; name:string}>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/api/categories').then(r => setCats(r.data))
    if (mode === 'edit' && id) {
      api.get(`/api/posts/${id}`).then(r => {
        const p = r.data
        setTitle(p.title)
        setSummary(p.summary || '')
        setIsPublished(p.is_published)
        setIsProtected(p.is_protected)
      })
      api.get(`/api/posts/${id}/content`).then(r => setContent(r.data.content || ''))
    }
  }, [mode, id])

  async function save() {
    setLoading(true)
    try {
      if (mode === 'new') {
        const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean)
        const r = await api.post('/api/posts', { title, summary, category_id: categoryId, is_published: isPublished, is_protected: isProtected, password: password || undefined, tags: tags.length ? tags : undefined })
        const pid = r.data.id
        if (content) await api.post(`/api/posts/${pid}/markdown`, { content })
      } else if (id) {
        const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean)
        await api.put(`/api/posts/${id}`, { title, summary, category_id: categoryId, is_published: isPublished, is_protected: isProtected, password: password || undefined, tags: tags.length ? tags : [] })
        if (content) await api.post(`/api/posts/${id}/markdown`, { content })
      }
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-light text-stone-900 mb-4">{mode === 'new' ? '新建文章' : '编辑文章'}</h1>
        <div className="grid gap-3">
          <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="摘要" value={summary} onChange={e => setSummary(e.target.value)} />
          <select className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900" value={categoryId ?? ''} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">选择板块</option>
            {cats.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <label className="flex items-center gap-2 text-stone-700"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />已发布</label>
          <label className="flex items-center gap-2 text-stone-700"><input type="checkbox" checked={isProtected} onChange={e => setIsProtected(e.target.checked)} />需要密码访问</label>
          {isProtected && <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="访问密码" value={password} onChange={e => setPassword(e.target.value)} />}
          <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="标签(用逗号分隔)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
          <textarea className="border border-stone-300 px-3 py-2 rounded h-64 bg-white text-stone-900 placeholder-stone-400" placeholder="Markdown 正文" value={content} onChange={e => setContent(e.target.value)} />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-stone-900 text-white rounded" onClick={save} disabled={loading}>保存</button>
            <button className="px-4 py-2 border border-stone-300 rounded" onClick={() => navigate('/admin')}>取消</button>
          </div>
        </div>
      </div>
    </div>
  )
}