export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  category_id: number;
  category?: Category;
  author_id: number;
  author?: User;
  tags?: Tag[];
  is_published: boolean;
  is_protected: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  tags?: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileUpload {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  scan_status: 'pending' | 'scanning' | 'clean' | 'infected' | 'error';
  scan_result?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}