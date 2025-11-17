import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/services/api'

export default function NoteDetail() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)
  const [content, setContent] = useState<string>('')
  const [needPassword, setNeedPassword] = useState(false)
  const [input, setInput] = useState('')
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.get(`/api/posts/${id}`).then(r => {
      setPost(r.data)
      setNeedPassword(r.data.is_protected)
      if (!r.data.is_protected) {
        api.get(`/api/posts/${id}/content`).then(c => setContent(c.data.content))
      }
    })
  }, [id])

  function submitPassword() {
    api.post(`/api/posts/${id}/access`, { password: input }).then(r => {
      const token = r.data.post_access_token
      setAccessToken(token)
      api.get(`/api/posts/${id}/content`, { headers: { Authorization: `Bearer ${token}` } }).then(c => setContent(c.data.content))
    })
  }

  if (!post) return <div>加载中</div>

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      {needPassword && !accessToken ? (
        <div className="bg-white p-4 rounded shadow flex gap-2">
          <input className="border px-2 py-1 flex-1" placeholder="输入访问密码" value={input} onChange={e => setInput(e.target.value)} />
          <button className="px-3 py-1 bg-primary text-white rounded" onClick={submitPassword}>访问</button>
        </div>
      ) : (
        <article className="bg-white p-4 rounded shadow" dangerouslySetInnerHTML={{ __html: content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') }} />
      )}
    </div>
  )
}