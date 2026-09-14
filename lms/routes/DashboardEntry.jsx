import { Navigate } from 'react-router-dom'
import { useAuth } from '../src/context/AuthContext'
import { UserDashboardPage } from '../src/pages/Dashboard/UserDashboardPage'

// Meniru `DashboardController::index()` di lms_apn:
// superadmin yang membuka /dashboard akan diarahkan ke /admin/dashboard,
// role lain (manager/staff) melihat dashboard biasa.
export function DashboardEntry() {
  const { hasRole } = useAuth()

  if (hasRole('superadmin')) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <UserDashboardPage />
}
