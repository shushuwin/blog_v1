import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Tag, Search, Filter } from 'lucide-react'
import { api } from '@/services/api'

type Post = {
  id: number
  title: string
  summary?: string
  created_at: string
  author?: { username: string }
  tags?: Array<{ id: number; name: string }>
  category?: { name: string }
}

export default function NotesList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Array<{id:number; name:string; slug:string; count:number}>>([])
  const [activeTag, setActiveTag] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTag])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [postsRes, tagsRes] = await Promise.all([
        api.get('/api/posts', { params: { page: 1, limit: 12, tag: activeTag || undefined, search: searchTerm || undefined } }),
        api.get('/api/tags')
      ])
      setPosts(postsRes.data.items || [])
      setTags(tagsRes.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
            笔记分享
          </h1>
          <p className="text-stone-600">
            技术笔记、学习心得与经验总结
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="搜索笔记..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                !activeTag 
                  ? 'bg-stone-800 text-white' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
              onClick={() => setActiveTag('')}
            >
              全部 ({tags.reduce((sum, tag) => sum + tag.count, 0)})
            </button>
            {tags.map(tag => (
              <button 
                key={tag.slug} 
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTag === tag.slug 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
                onClick={() => setActiveTag(tag.slug)}
              >
                {tag.name} ({tag.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg">
                <div className="animate-pulse">
                  <div className="h-4 bg-stone-200 rounded mb-3"></div>
                  <div className="h-3 bg-stone-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-stone-200 rounded mb-4 w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-stone-200 rounded"></div>
                    <div className="h-2 bg-stone-200 rounded"></div>
                    <div className="h-2 bg-stone-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/notes/${post.id}`} className="block">
                  <div className="mb-4">
                    <span className="text-sm text-stone-500 font-medium">
                      {post.category?.name || '笔记'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-medium text-stone-900 mb-3 group-hover:text-stone-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-stone-600 text-sm mb-6 line-clamp-3">
                    {post.summary || '这篇笔记暂无摘要...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {('uploader_name' in (post as any) ? (post as any).uploader_name : '') || post.author?.username || '未知作者'}
                      </span>
                    </div>
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-stone-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-stone-900 mb-2">没有找到相关笔记</h3>
            <p className="text-stone-600">尝试调整搜索条件或选择不同的标签</p>
          </div>
        )}
      </div>
    </div>
  )
}