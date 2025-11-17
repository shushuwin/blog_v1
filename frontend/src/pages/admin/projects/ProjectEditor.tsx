import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/services/api'

type Mode = 'new' | 'edit'

export default function ProjectEditor({ mode }: { mode: Mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.get(`/api/projects/${id}`).then(r => {
        const p = r.data
        setName(p.name)
        setDescription(p.description || '')
      })
      api.get(`/api/projects/${id}/content`).then(r => setContent(r.data.content || ''))
    }
  }, [mode, id])

  async function save() {
    setLoading(true)
    try {
      if (mode === 'new') {
        const r = await api.post('/api/projects', { name, description, demo_url: demoUrl, source_url: sourceUrl, cover_image: coverImage })
        const pid = r.data.id
        if (content) await api.post(`/api/projects/${pid}/markdown`, { content })
      } else if (id) {
        await api.put(`/api/projects/${id}`, { name, description, demo_url: demoUrl, source_url: sourceUrl, cover_image: coverImage })
        if (content) await api.post(`/api/projects/${id}/markdown`, { content })
      }
      navigate('/admin/projects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-3 max-w-3xl">
      <h1 className="text-2xl font-semibold">{mode === 'new' ? '新建项目' : '编辑项目'}</h1>
      <input className="border px-2 py-1" placeholder="名称" value={name} onChange={e => setName(e.target.value)} />
      <textarea className="border px-2 py-1" placeholder="描述" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="border px-2 py-1" placeholder="演示地址" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} />
      <input className="border px-2 py-1" placeholder="源码地址" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} />
      <input className="border px-2 py-1" placeholder="封面URL" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
      <textarea className="border px-2 py-1 h-64" placeholder="Markdown 正文" value={content} onChange={e => setContent(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-primary text-white rounded" onClick={save} disabled={loading}>保存</button>
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => navigate('/admin/projects')}>取消</button>
      </div>
    </div>
  )
}