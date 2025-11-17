import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/services/api'

type Item = { id: number; title: string; summary?: string }

export default function LifeList() {
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    api.get('/api/life-posts', { params: { page: 1, limit: 10 } }).then(r => setItems(r.data.items || []))
  }, [])
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">个人生活</h1>
          <p className="text-stone-600">记录生活点滴与思考</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((i, index) => (
            <motion.div key={i.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}>
              <Link to={`/life/${i.id}`} className="block bg-white p-6 rounded-lg hover:shadow-lg transition-all">
                <div className="text-lg font-medium text-stone-900 mb-2">{i.title}</div>
                <div className="text-sm text-stone-600 line-clamp-2">{i.summary || ''}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}