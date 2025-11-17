import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'

export default function FileManager() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [md5, setMd5] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState('')

  async function upload() {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const r = await api.post('/api/files/upload', form)
    setResult(r.data)
    setMd5(r.data.md5)
  }

  async function uploadImage() {
    if (!image) return
    const form = new FormData()
    form.append('file', image)
    const r = await api.post('/api/files/upload-image', form)
    setImagePath(r.data.path)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">文件管理</h1>
        <div className="flex gap-2">
          <Link to="/admin" className="px-3 py-1 bg-gray-200 rounded">文章</Link>
          <Link to="/admin/projects" className="px-3 py-1 bg-gray-200 rounded">项目</Link>
          <Link to="/admin/files" className="px-3 py-1 bg-primary text-white rounded">文件</Link>
          <Link to="/admin/users" className="px-3 py-1 bg-gray-200 rounded">用户</Link>
          <Link to="/admin/settings" className="px-3 py-1 bg-gray-200 rounded">设置</Link>
        </div>
      </div>
      <div className="grid gap-3 max-w-xl">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="px-3 py-1 bg-primary text-white rounded w-fit" onClick={upload}>上传</button>
        {result && <div className="text-sm text-gray-700">MD5: {md5}</div>}

        <h2 className="text-xl font-semibold mt-6">上传图片</h2>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
        <button className="px-3 py-1 bg-primary text-white rounded w-fit" onClick={uploadImage}>上传图片</button>
        {imagePath && <img src={imagePath} alt="uploaded" className="mt-2 max-w-xs rounded" />}
      </div>
    </div>
  )
}