import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Shield, Zap, Cpu } from 'lucide-react';
import { getLatestPosts } from '../../services/api';
import { Post } from '../../types';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getLatestPosts(6);
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  

  return (
    <div className="min-h-screen">
      

      {/* Hero Section */}
      <section 
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Glitch Effect Title */}
            <div className="relative mb-8">
              <motion.h1 
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(6,182,212,0.5)",
                    "0 0 40px rgba(168,85,247,0.5)",
                    "0 0 20px rgba(6,182,212,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CYBER
              </motion.h1>
              <motion.h2 
                className="text-4xl md:text-6xl font-light bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                SECURITY LAB
              </motion.h2>
            </div>
            
            <motion.p 
              className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              探索网络安全的无限维度，在数字世界的边缘寻找真相
              <br />
              <span className="text-cyan-500">// where security meets infinity</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Link 
                to="/posts" 
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  进入矩阵
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
              </Link>
              
              <Link 
                to="/projects" 
                className="inline-flex items-center px-8 py-3 border border-stone-300 text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              >
                实战项目
              </Link>
            </motion.div>
          </motion.div>
        </div>

        
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 px-6 bg-stone-100/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">最新文章</h2>
            <p className="text-stone-600">精选近期更新内容</p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
                  <div className="animate-pulse">
                    <div className="h-32 bg-stone-200 rounded mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded mb-2"></div>
                    <div className="h-4 bg-stone-200 rounded mb-2"></div>
                    <div className="h-3 bg-stone-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white p-8 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/posts/${post.id}`} className="block">
                    <div className="mb-4">
                      <span className="text-sm text-stone-500 font-medium">
                        {post.category?.name || '未分类'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-medium text-stone-900 mb-3 group-hover:text-stone-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-stone-600 text-sm mb-6 line-clamp-3">
                      {post.excerpt || '暂无摘要'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.uploader_name || post.author?.username || '未知作者'}
                        </span>
                      </div>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs"
                          >
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

          <div className="text-center mt-16">
            <Link 
              to="/posts" 
              className="inline-flex items-center text-stone-700 hover:text-stone-900 transition-colors"
            >
              查看所有文章
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-stone-700" />
              </div>
              <h3 className="text-3xl font-light text-stone-900 mb-2">1000+</h3>
              <p className="text-stone-600">安全防护方案</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-stone-700" />
              </div>
              <h3 className="text-3xl font-light text-stone-900 mb-2">500+</h3>
              <p className="text-stone-600">实战项目案例</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Cpu className="w-12 h-12 text-stone-700" />
              </div>
              <h3 className="text-3xl font-light text-stone-900 mb-2">24/7</h3>
              <p className="text-stone-600">技术更新支持</p>
            </motion.div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;