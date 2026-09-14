import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../src/context/AuthContext'

// Route guard mock untuk FE ini. Cek dilakukan berdasarkan `role`/`permission`
// yang tersimpan di AuthContext (mengikuti `auth.user` & `auth.permissions`
// dari backend), bukan sekadar path.
//
// - Belum login -> redirect ke /login
// - Login tapi role/permission tidak sesuai -> redirect ke home role dia sendiri
export function ProtectedRoute({ roles, permission, children }) {
  const { user, isAuthenticated, hasRole, can, homePath } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  const roleAllowed = !roles || hasRole(roles)
  const permissionAllowed = !permission || can(permission)

  if (!roleAllowed || !permissionAllowed) {
    return <Navigate to={homePath} replace />
  }

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, homePath } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={homePath} replace />
  }

  return children
}
