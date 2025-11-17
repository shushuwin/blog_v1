import { useEffect, useState } from 'react'
 
import { api } from '@/services/api'

export default function Settings() {
  const [uploadDir, setUploadDir] = useState('')
  const [modelPath, setModelPath] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/api/settings').then(r => {
      setUploadDir(r.data.upload_dir)
      setModelPath(r.data.model_path || '')
    })
  }, [])

  async function save() {
    await api.put('/api/admin/settings', { MALWARE_MODEL_PATH: modelPath })
    setMsg('已保存')
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-stone-900">系统设置</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6 max-w-xl">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm text-stone-600">上传目录</label>
              <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900" value={uploadDir} readOnly />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-stone-600">恶意检测模型路径</label>
              <input className="border border-stone-300 px-3 py-2 rounded bg-white text-stone-900 placeholder-stone-400" value={modelPath} onChange={e => setModelPath(e.target.value)} />
            </div>
            <button className="px-4 py-2 bg-stone-900 text-white rounded w-fit" onClick={save}>保存</button>
            {msg && <div className="text-green-700 text-sm">{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}