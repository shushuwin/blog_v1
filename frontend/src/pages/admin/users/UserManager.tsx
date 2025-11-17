import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Calendar, Trash2, Crown } from 'lucide-react';
import { LuxuryCard } from '../../../components/ui/luxury-card';
import { getUsers, updateUserRole, deleteUser } from '../../../services/api';
import { User as UserType } from '../../../types';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error: any) {
      setError(error.response?.data?.detail || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, isAdmin: boolean) => {
    try {
      await updateUserRole(userId, isAdmin);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: isAdmin } : user
      ));
    } catch (error: any) {
      setError(error.response?.data?.detail || '更新用户权限失败');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复。')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      setError(error.response?.data?.detail || '删除用户失败');
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                人员管理
              </h1>
              <p className="text-xl text-gray-400">
                管理系统中的所有注册用户，只有管理员可以访问此页面
              </p>
            </div>
            
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
          >
            {error}
          </motion.div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">暂无用户</h3>
              <p className="text-gray-400">系统中还没有注册用户</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-stone-50 rounded hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-stone-200 rounded flex items-center justify-center">
                      <User className="w-6 h-6 text-stone-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 text-lg">{user.username}</h3>
                      <p className="text-stone-600">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-stone-500">
                          注册于 {new Date(user.created_at).toLocaleDateString()}
                        </span>
                        {user.is_admin && (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                            <Crown className="w-3 h-3" />
                            <span>管理员</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-2 rounded text-sm font-medium bg-stone-200 text-stone-700">
                      {user.is_admin ? '管理员' : '普通用户'}
                    </span>

                    {!user.is_admin && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;