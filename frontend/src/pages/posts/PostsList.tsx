import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPosts } from '../../services/api';
import { Post } from '../../types';

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const data = await getPosts(currentPage, 12);
      setPosts(data.items);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

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
            所有文章
          </h1>
          <p className="text-stone-600">
            探索网络安全领域的深度文章和技术分享
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(12)].map((_, i) => (
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
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
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
                          {(post as any).uploader_name || post.author?.username || '未知作者'}
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

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-2"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  上一页
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded ${
                          currentPage === page
                            ? 'bg-stone-800 text-white'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  下一页
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostsList;