import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/services/api'

export default function LifeDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<any>(null)
  const [content, setContent] = useState('')
  useEffect(() => {
    if (!id) return
    api.get(`/api/life-posts/${id}`).then(r => setItem(r.data))
    api.get(`/api/life-posts/${id}/content`).then(r => setContent(r.data.content || ''))
  }, [id])
  if (!item) return <div className="min-h-screen py-20 px-6 text-center text-stone-600">加载中</div>
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-light text-stone-900">{item.title}</h1>
        </motion.div>
        <article className="bg-white p-6 rounded-lg shadow" dangerouslySetInnerHTML={{ __html: content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') }} />
      </div>
    </div>
  )
}