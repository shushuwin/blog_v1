import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/home/HomePage'
import NotesList from './pages/notes/NotesList'
import NoteDetail from './pages/notes/NoteDetail'
import ProjectsList from './pages/projects/ProjectsList'
import ProjectDetail from './pages/projects/ProjectDetail'
import LifeList from './pages/life/LifeList'
import LifeDetail from './pages/life/LifeDetail'
import ToolsList from './pages/tools/ToolsList'
import FileScanner from './pages/tools/FileScanner'
import MalwareScan from './pages/tools/MalwareScan'
import AdminLogin from './pages/admin/login/AdminLogin'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/profile/Profile'
import UserManager from './pages/admin/users/UserManager'
import PublishManager from './pages/admin/publish/PublishManager'
import PostEditor from './pages/admin/posts/PostEditor'
import AdminLayout from './components/admin/AdminLayout'
import Settings from './pages/admin/settings/Settings'
import ProtectedRoute from './components/common/ProtectedRoute'
import MarkdownImport from './pages/admin/import/MarkdownImport'
import NavbarNew from './components/Navbar-new'
import PostsList from './pages/posts/PostsList'
import PostDetail from './pages/posts/PostDetail'
import TagsList from './pages/tags/TagsList'

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {!isAdmin && <NavbarNew />}
      <main className={isAdmin ? '' : 'pt-16'}>{children}</main>
      {!isAdmin && (
        <motion.div
          className="fixed bottom-6 right-6 w-10 h-10 bg-stone-800 text-stone-50 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-40 hover:bg-stone-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/notes" element={<NotesList />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/life" element={<LifeList />} />
        <Route path="/life/:id" element={<LifeDetail />} />
        <Route path="/tools" element={<ToolsList />} />
        <Route path="/tools/malware-scan" element={<MalwareScan />} />
        <Route path="/tags" element={<TagsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><PublishManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/posts/new" element={<ProtectedRoute><AdminLayout><PostEditor mode="new" /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/posts/edit/:id" element={<ProtectedRoute><AdminLayout><PostEditor mode="edit" /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminLayout><UserManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/import/markdown" element={<ProtectedRoute><AdminLayout><MarkdownImport /></AdminLayout></ProtectedRoute>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  )
}