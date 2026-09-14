import { Users, BookOpen, TrendingUp } from 'lucide-react'

import { MainLayout } from '../../layouts/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { getDivisionDashboardPayload } from '../../data/dashboard'

const DIVISION_CARD_COLORS = {
  'Anggota Divisi': '#c81e2a',
  'Learning Path Aktif': '#d32b36',
  'Rata-rata Progress': '#e9434e',
}

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
        {stats.map((stat) => {
          const cardColor = DIVISION_CARD_COLORS[stat.label] ?? '#c81e2a'

          return (
            <Card key={stat.label} style={{ borderLeft: `4px solid ${cardColor}` }}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon size={18} className="text-black/40 dark:text-white/40" />
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-3xl font-semibold text-[#1f2937] dark:text-white">{stat.value}</CardTitle>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </MainLayout>
  )
}

export default DivisionDashboardPage
