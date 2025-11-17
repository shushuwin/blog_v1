import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('access_token', token)
  } else {
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem('access_token')
  }
  try {
    window.dispatchEvent(new CustomEvent('auth-updated'))
  } catch {}
}

const stored = localStorage.getItem('access_token')
if (stored) setAuthToken(stored)

api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) {
      setAuthToken(null)
      if (location.pathname.startsWith('/admin')) {
        location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

// Posts API
export const getLatestPosts = async (limit: number = 6) => {
  const response = await api.get(`/api/posts/latest?limit=${limit}`)
  return response.data
}

export const getPosts = async (page: number = 1, limit: number = 10, category?: string, tag?: string) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
  if (category) params.append('category', category)
  if (tag) params.append('tag', tag)
  
  const response = await api.get(`/api/posts?${params}`)
  return response.data
}

export const getPost = async (id: number) => {
  const response = await api.get(`/api/posts/${id}`)
  return response.data
}

export const createPost = async (data: any) => {
  const response = await api.post('/api/posts', data)
  return response.data
}

export const updatePost = async (id: number, data: any) => {
  const response = await api.put(`/api/posts/${id}`, data)
  return response.data
}

export const deletePost = async (id: number) => {
  const response = await api.delete(`/api/posts/${id}`)
  return response.data
}

// Tags API
export const getTags = async () => {
  const response = await api.get('/api/tags')
  return response.data
}

export const getPostsByTag = async (tagId: number) => {
  const response = await api.get(`/api/tags/${tagId}/posts`)
  return response.data
}

// Categories API
export const getCategories = async () => {
  const response = await api.get('/api/categories')
  return response.data
}

// Auth API
export const login = async (username: string, password: string) => {
  const response = await api.post('/api/auth/login', { username, password })
  return response.data
}

export const register = async (username: string, password: string, email: string) => {
  const response = await api.post('/api/auth/register', { username, password, email })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}

export const getUserPosts = async () => {
  const response = await api.get('/api/posts/user')
  return response.data
}

// User Management API (Admin only)
export const getUsers = async () => {
  const response = await api.get('/api/admin/users')
  return response.data
}

export const updateUserRole = async (userId: number, isAdmin: boolean) => {
  const response = await api.put(`/api/admin/users/${userId}/role`, { is_admin: isAdmin })
  return response.data
}

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/api/admin/users/${userId}`)
  return response.data
}

// File Upload API
export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// Markdown Import API
export const uploadMarkdown = async (formData: FormData) => {
  const response = await api.post('/api/posts/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}