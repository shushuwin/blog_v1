import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function isTokenValid(token: string | null) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  try {
    const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))))
    if (!payload.exp) return false
    const now = Math.floor(Date.now() / 1000)
    return payload.exp > now
  } catch {
    return false
  }
}

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('access_token')

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isTokenValid(token)) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />
  }

  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/" replace />
  }

  if (!requireAdmin && !user) {
    return <Navigate to="/login" replace />
  }

  return children
}