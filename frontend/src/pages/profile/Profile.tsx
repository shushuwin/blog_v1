import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Mail, Shield, FileText, Code, Heart } from 'lucide-react';
 
import { getLatestPosts } from '../../services/api';
import { Post } from '../../types';

const Profile: React.FC = () => {
  const [author, setAuthor] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthorAndPosts();
  }, []);

  const fetchAuthorAndPosts = async () => {
    try {
      const a = await fetch('/api/auth/author').then(r => r.json());
      setAuthor(a);
      const latest = await getLatestPosts(5);
      setPosts(latest);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-stone-700" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-light text-stone-900 mb-2">{author?.username || '站长'}</h1>
                <div className="flex items-center gap-4 text-stone-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{author?.email || 'admin@example.com'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{author?.created_at ? `加入于 ${new Date(author.created_at).toLocaleDateString()}` : '作者主页'}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-stone-700">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">
                    管理员
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FileText className="w-8 h-8 text-stone-700 mx-auto mb-2" />
              <div className="text-2xl font-light text-stone-900">{posts.length}</div>
              <div className="text-stone-600">文章</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Code className="w-8 h-8 text-stone-700 mx-auto mb-2" />
              <div className="text-2xl font-light text-stone-900">0</div>
              <div className="text-stone-600">项目</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Heart className="w-8 h-8 text-stone-700 mx-auto mb-2" />
              <div className="text-2xl font-light text-stone-900">0</div>
              <div className="text-stone-600">生活分享</div>
            </div>
          </div>

          {/* 最近文章 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium text-stone-900 mb-6">最近文章</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-stone-200 rounded mb-2"></div>
                    <div className="h-3 bg-stone-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-stone-900 mb-1">{post.title}</h3>
                      <p className="text-sm text-stone-600">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-stone-200 text-stone-700 rounded text-xs">
                      {post.category?.name || '未分类'}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <p className="text-stone-600">还没有发布任何文章</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;