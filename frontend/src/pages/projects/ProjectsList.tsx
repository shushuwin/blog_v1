import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Calendar, User, Github, ExternalLink, Star, GitFork } from 'lucide-react'
import { api } from '@/services/api'

type Project = {
  id: number
  name: string
  description?: string
  created_at: string
  author?: { username: string }
  github_url?: string
  demo_url?: string
  stars?: number
  language?: string
  tags?: Array<{ id: number; name: string }>
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')

  useEffect(() => {
    fetchProjects()
  }, [selectedLanguage])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/projects', { 
        params: { 
          page: 1, 
          limit: 12,
          language: selectedLanguage || undefined
        } 
      })
      setProjects(res.data.items || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const languages = ['JavaScript', 'Python', 'Go', 'Rust', 'TypeScript', 'Java']

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
            实战项目
          </h1>
          <p className="text-stone-600">
            开源项目、实战案例与技术实践
          </p>
        </motion.div>

        {/* Language Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                !selectedLanguage 
                  ? 'bg-stone-800 text-white' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
              onClick={() => setSelectedLanguage('')}
            >
              全部项目
            </button>
            {languages.map(lang => (
              <button 
                key={lang} 
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedLanguage === lang 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-stone-200 rounded-lg mr-4"></div>
                    <div>
                      <div className="h-4 bg-stone-200 rounded mb-2 w-24"></div>
                      <div className="h-3 bg-stone-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-stone-200 rounded mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded mb-4 w-5/6"></div>
                  <div className="flex gap-4">
                    <div className="h-3 bg-stone-200 rounded w-12"></div>
                    <div className="h-3 bg-stone-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mr-4">
                      <Code className="w-6 h-6 text-stone-600" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 font-medium">
                        {project.language || '未知语言'}
                      </span>
                    </div>
                  </div>
                  {project.stars && (
                    <div className="flex items-center gap-1 text-stone-500">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">{project.stars}</span>
                    </div>
                  )}
                </div>
                
                <Link to={`/projects/${project.id}`} className="block mb-4">
                  <h3 className="text-xl font-medium text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-stone-600 text-sm mb-6 line-clamp-3">
                    {project.description || '这个项目暂无描述...'}
                  </p>
                </Link>
                
                <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {project.author?.username || '未知作者'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-stone-800 text-white rounded text-sm hover:bg-stone-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Github className="w-3 h-3" />
                      源码
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 border border-stone-300 text-stone-700 rounded text-sm hover:bg-stone-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      演示
                    </a>
                  )}
                </div>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-stone-400 mb-4">
              <Code className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-stone-900 mb-2">暂无项目</h3>
            <p className="text-stone-600">该分类下还没有项目，敬请期待</p>
          </div>
        )}
      </div>
    </div>
  )
}