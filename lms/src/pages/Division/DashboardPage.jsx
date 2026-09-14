import { Users, BookOpen, TrendingUp } from 'lucide-react'

import { MainLayout } from '../../layouts/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { getDivisionDashboardPayload } from '../../data/dashboard'

// Meniru `resources/js/pages/division/dashboard.tsx` di lms_apn: halaman ini
// hanya dapat diakses user yang punya `division` (dicek lewat ProtectedRoute).
export function DivisionDashboardPage() {
  const { user } = useAuth()
  const payload = getDivisionDashboardPayload(user?.division)

  if (!payload) {
    return (
      <MainLayout title="Area Divisi">
        <Card>
          <CardContent className="p-8 text-center text-black/50 dark:text-white/50">
            Akun ini belum terhubung ke divisi manapun.
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  const stats = [
    { label: 'Anggota Divisi', value: payload.stats.members_count, icon: Users },
    { label: 'Learning Path Aktif', value: payload.stats.active_learning_paths, icon: BookOpen },
    { label: 'Rata-rata Progress', value: `${payload.stats.average_progress}%`, icon: TrendingUp },
  ]

  return (
    <MainLayout
      title={`Area ${payload.division.name}`}
      subtitle="Pantau perkembangan belajar anggota di divisi kamu."
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardDescription>{stat.label}</CardDescription>
              <stat.icon size={18} className="text-black/40 dark:text-white/40" />
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-3xl font-semibold">{stat.value}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </section>
    </MainLayout>
  )
}

export default DivisionDashboardPage
