import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'

export default function MarkdownImport() {
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState<'post' | 'project'>('project')
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [uploader, setUploader] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isProtected, setIsProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [msg, setMsg] = useState('')

  async function submit() {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    if (target === 'project') {
      if (name) form.append('name', name)
      if (description) form.append('description', description)
      if (uploader) form.append('uploader_name', uploader)
      const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean)
      if (tags.length) form.append('tags', tags.join(','))
      form.append('is_published', String(isPublished))
      form.append('is_protected', String(isProtected))
      if (isProtected && password) form.append('password', password)
      const r = await api.post('/api/projects/upload', form)
      setMsg(`已导入项目: ${r.data.id}`)
    } else {
      if (name) form.append('title', name)
      if (summary) form.append('summary', summary)
      form.append('is_published', String(isPublished))
      form.append('is_protected', String(isProtected))
      if (password) form.append('password', password)
      if (uploader) form.append('uploader_name', uploader)
      const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean)
      if (tags.length) form.append('tags', tags.join(','))
      const r = await api.post('/api/posts/upload', form)
      setMsg(`已导入文章: ${r.data.id}`)
    }
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-stone-900">导入Markdown文件</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6 max-w-xl">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm text-stone-600">目标板块</label>
              <select className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900" value={target} onChange={e => setTarget(e.target.value as any)}>
                <option value="project">实战项目</option>
                <option value="post">笔记分享</option>
              </select>
            </div>
            <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="名称/标题(可选)" value={name} onChange={e => setName(e.target.value)} />
            {(target === 'post') && (
              <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="摘要(可选)" value={summary} onChange={e => setSummary(e.target.value)} />
            )}
            {(target === 'post') && (
              <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="上传者(可选)" value={uploader} onChange={e => setUploader(e.target.value)} />
            )}
            <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900" type="file" accept=".md,text/markdown" onChange={e => setFile(e.target.files?.[0] || null)} />
            {target === 'project' && (
              <>
                <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="摘要(可选)" value={description} onChange={e => setDescription(e.target.value)} />
                <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="上传者(可选)" value={uploader} onChange={e => setUploader(e.target.value)} />
                <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="标签(用逗号分隔)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
              </>
            )}
            {target === 'project' && (
              <label className="flex items-center gap-2 text-stone-700"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />已发布</label>
            )}
            {target === 'project' && (
              <>
                <label className="flex items-center gap-2 text-stone-700"><input type="checkbox" checked={isProtected} onChange={e => setIsProtected(e.target.checked)} />需要密码访问</label>
                {isProtected && <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="访问密码" value={password} onChange={e => setPassword(e.target.value)} />}
              </>
            )}
            {target === 'post' && (
              <>
                <label className="flex items-center gap-2 text-stone-700"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />已发布</label>
                <label className="flex items-center gap-2 text-stone-700"><input type="checkbox" checked={isProtected} onChange={e => setIsProtected(e.target.checked)} />需要密码访问</label>
                {isProtected && <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="访问密码" value={password} onChange={e => setPassword(e.target.value)} />}
                <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" placeholder="标签(用逗号分隔)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
              </>
            )}
            <button className="px-4 py-2 bg-stone-900 text-white rounded w-fit" onClick={submit}>上传</button>
            {msg && <div className="text-green-700 text-sm">{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}