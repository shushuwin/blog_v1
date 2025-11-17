import { useState } from 'react'
import { api } from '@/services/api'

type ScanResult = {
  label: 'malicious' | 'benign'
  confidence: number
}

export default function FileScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!file) return
    setLoading(true)
    setError('')
    const form = new FormData()
    form.append('file', file)
    try {
      const r = await api.post('/api/files/scan', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(r.data)
    } catch (e: any) {
      setError('检测失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">恶意文件检测</h1>
      <div className="bg-white p-4 rounded shadow grid gap-2">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="px-3 py-1 bg-primary text-white rounded w-fit" onClick={submit} disabled={loading}>上传并检测</button>
        {error && <div className="text-red-600">{error}</div>}
        {result && (
          <div className="grid gap-1">
            <div>结果：{result.label === 'malicious' ? '恶意' : '正常'}</div>
            <div>置信度：{Math.round(result.confidence * 100)}%</div>
          </div>
        )}
        <div className="text-sm text-gray-600">不要上传隐私文件，仅用于学习演示</div>
      </div>
    </div>
  )
}