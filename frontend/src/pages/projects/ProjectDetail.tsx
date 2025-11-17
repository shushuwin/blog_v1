import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/services/api'

export default function ProjectDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<any>(null)
  const [content, setContent] = useState('')
  useEffect(() => {
    if (!id) return
    api.get(`/api/projects/${id}`).then(r => setItem(r.data))
    api.get(`/api/projects/${id}/content`).then(r => setContent(r.data.content || ''))
  }, [id])
  if (!item) return <div>加载中</div>
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">{item.name}</h1>
      <article className="bg-white p-4 rounded shadow" dangerouslySetInnerHTML={{ __html: content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') }} />
    </div>
  )
}