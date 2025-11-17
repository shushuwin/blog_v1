import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag as TagIcon, FileText } from 'lucide-react';
import { LuxuryCard, LuxuryButton } from '../../components/ui/luxury-card';
import { getTags } from '../../services/api';
import { Tag } from '../../types';

const TagsList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            标签分类
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            通过标签浏览文章，发现感兴趣的技术主题
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <LuxuryCard variant="glass" className="h-40">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            {tags.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <LuxuryCard variant="glass" className="max-w-md mx-auto">
                  <div className="text-center py-8">
                    <TagIcon size={48} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">暂无标签</h3>
                    <p className="text-gray-400">目前还没有创建任何标签。</p>
                  </div>
                </LuxuryCard>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Link to={`/posts?tag=${tag.name}`}>
                      <LuxuryCard variant="gradient" className="h-full group cursor-pointer">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
                              <TagIcon className="w-6 h-6 text-white" />
                            </div>
                            <FileText className="w-4 h-4 text-purple-400" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                            {tag.name}
                          </h3>
                          
                          {tag.description && (
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                              {tag.description}
                            </p>
                          )}
                          
                          <div className="mt-auto pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-purple-400 font-medium">
                                查看文章
                              </span>
                              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </LuxuryCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TagsList;