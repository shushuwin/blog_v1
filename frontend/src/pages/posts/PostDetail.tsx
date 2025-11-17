import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, MessageCircle, Heart, Share2, Shield } from 'lucide-react';
import { getPost } from '../../services/api';
import { Post } from '../../types';
import MarkdownViewer from '../../components/ui/MarkdownViewer';
import { useAuth } from '../../hooks/useAuth';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async (postPassword?: string) => {
    try {
      const data = await getPost(parseInt(id!));
      if (data.password_required && !postPassword) {
        setPasswordRequired(true);
        setLoading(false);
        return;
      }
      setPost(data);
      setPasswordRequired(false);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setPasswordRequired(true);
        setPasswordError('密码错误，请重试');
      } else {
        console.error('Failed to fetch post:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    await fetchPost(password);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('请先登录后再评论');
      return;
    }
    // 这里添加评论提交逻辑
    console.log('提交评论:', commentText);
    setCommentText('');
    setShowCommentForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg">
            <div className="animate-pulse">
              <div className="h-8 bg-stone-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-4 bg-stone-200 rounded mb-8 w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-stone-200 rounded"></div>
                <div className="h-4 bg-stone-200 rounded"></div>
                <div className="h-4 bg-stone-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen py-16 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-stone-600" />
              </div>
              <h2 className="text-2xl font-medium text-stone-900 mb-2">文章受密码保护</h2>
              <p className="text-stone-600">请输入密码以查看文章内容</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors"
              >
                查看文章
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-medium text-stone-900 mb-4">文章未找到</h2>
            <p className="text-stone-600 mb-6">抱歉，无法找到您请求的文章。</p>
            <Link to="/posts">
              <button className="px-6 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors">
                返回文章列表
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/posts" className="inline-flex items-center text-stone-600 hover:text-stone-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回文章列表
          </Link>

          <article className="bg-white rounded-lg p-8 md:p-12">
            <header className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span className="text-sm text-stone-500 font-medium">
                  {post.category?.name || '未分类'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-light text-stone-900 mb-8 leading-tight"
              >
                {post.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-stone-600 text-sm"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.uploader_name || post.author?.username || '未知作者'}
                </span>
              </motion.div>

              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 mt-6"
                >
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </motion.div>
              )}
            </header>

            {post.excerpt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12 p-6 bg-stone-50 rounded-lg"
              >
                <p className="text-stone-700 leading-relaxed">
                  {post.excerpt}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="prose prose-lg max-w-none prose-stone"
            >
              <MarkdownViewer content={post.content} />
            </motion.div>
          </article>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-white rounded-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-stone-900">评论</h3>
              {!user && (
                <p className="text-sm text-stone-600">
                  需要 <Link to="/login" className="text-stone-800 hover:underline">登录</Link> 后才能评论
                </p>
              )}
            </div>

            {user && (
              <div className="mb-8">
                {!showCommentForm ? (
                  <button
                    onClick={() => setShowCommentForm(true)}
                    className="px-6 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    写评论
                  </button>
                ) : (
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="分享你的想法..."
                      rows={4}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors"
                      >
                        发布评论
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCommentForm(false)}
                        className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-100 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="space-y-6">
              {/* 示例评论 - 这里可以替换为真实的评论数据 */}
              <div className="border-b border-stone-200 pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-stone-200 rounded-full"></div>
                  <div>
                    <p className="font-medium text-stone-900">用户名</p>
                    <p className="text-sm text-stone-600">2025年1月15日</p>
                  </div>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  这篇文章写得很好，对网络安全的理解很深入。特别是关于防护策略的部分，让我学到了很多新知识。
                </p>
              </div>
              
              <div className="text-center py-8">
                <p className="text-stone-600">暂无更多评论</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetail;