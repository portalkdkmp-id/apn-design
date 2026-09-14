import { Link } from 'react-router-dom'
import {
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Layers3,
  PlayCircle,
  TrendingUp,
} from 'lucide-react'

import { MainLayout } from '../../layouts/MainLayout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { getUserDashboardPayload } from '../../data/dashboard'

const DASHBOARD_CARD_COLORS = {
  'Ujian Aktif': '#c81e2a',
  'Learning Path': '#d32b36',
  'Progress Ujian': '#e9434e',
  'Progress Modul': '#fa636d',
}

export function UserDashboardPage() {
  const { user } = useAuth()
  const { stats, completedLearning, continueLearning } = getUserDashboardPayload()

  const examProgress = `${stats.completed_exams_count} / ${stats.active_exams_count}`
  const moduleProgress = `${stats.learned_modules_count} / ${stats.modules_count}`

  const summaryStats = [
    {
      label: 'Ujian Aktif',
      value: stats.active_exams_count,
      description: 'Ujian tersedia sesuai role dan jadwal.',
      href: '/tests',
      icon: ClipboardCheck,
    },
    {
      label: 'Learning Path',
      value: stats.learning_paths_count,
      description: `${stats.modules_count} modul aktif tersedia.`,
      href: '/learning-paths',
      icon: BookOpen,
    },
    {
      label: 'Progress Ujian',
      value: examProgress,
      description: 'Sudah dikerjakan / total ujian.',
      href: '/tests',
      icon: TrendingUp,
    },
    {
      label: 'Progress Modul',
      value: moduleProgress,
      description: 'Modul dipelajari / total modul.',
      href: '/learning-paths',
      icon: Layers3,
    },
  ]

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Pantau ujian aktif dan lanjutkan materi terakhir yang kamu pelajari."
      actions={
        user?.division && (
          <Button as={Link} to="/division/dashboard" variant="outline" size="sm">
            <Building2 size={16} />
            Area {user.division.name}
          </Button>
        )
      }
    >
      <div className="mb-6">
        <Badge variant="outline">Dashboard</Badge>
        <h2 className="mt-2 text-lg font-medium">Selamat datang, {user?.name}</h2>
      </div>

      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => {
          const cardColor = DASHBOARD_CARD_COLORS[stat.label] ?? '#c81e2a'

          return (
            <Link key={stat.label} to={stat.href} className="group block">
              <Card className="h-full rounded-2xl transition duration-200 hover:-translate-y-1 hover:shadow-md" style={{ borderLeft: `4px solid ${cardColor}` }}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle className="text-3xl font-semibold text-[#1f2937] dark:text-white">{stat.value}</CardTitle>
                  </div>
                  <stat.icon size={20} className="opacity-70" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-black/50 dark:text-white/50">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Materi yang sudah dipelajari</CardTitle>
              <CardDescription>Learning path dengan seluruh modul yang sudah selesai dipelajari.</CardDescription>
            </div>
            <Button as={Link} to="/learning-paths" variant="outline" size="sm">
              <BookOpen size={16} />
              Semua learning path
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {completedLearning.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {completedLearning.map((path) => (
                <Card key={path.id} className="border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base">{path.title}</CardTitle>
                      <Badge className="bg-emerald-600 text-white">100%</Badge>
                    </div>
                    <CardDescription>
                      {path.completed_modules} dari {path.total_modules} modul selesai
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950">
                      <div className="h-2 rounded-full bg-emerald-600" style={{ width: '100%' }} />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm text-black/50 dark:text-white/50">
                      <span>Terakhir dipelajari</span>
                      <span>{path.last_learned_at ?? '-'}</span>
                    </div>
                    <Button as={Link} to={path.continue_url} className="w-full">
                      Pelajari Lagi
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 p-8 text-center text-black/50 dark:border-white/15 dark:text-white/50">
              Belum ada materi yang selesai dipelajari
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Lanjutkan Belajar</CardTitle>
              <CardDescription>Learning path dan modul yang tersedia untuk role kamu.</CardDescription>
            </div>
            <Button as={Link} to="/learning-paths" variant="outline" size="sm">
              <BookOpen size={16} />
              Semua learning path
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {continueLearning.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-black/5 text-left dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 font-medium">Learning Path</th>
                    <th className="px-4 py-3 font-medium">Modul</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Terakhir dipelajari</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {continueLearning.map((path) => (
                    <tr key={path.id} className="border-t border-black/5 dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{path.title}</div>
                        <div className="mt-1 text-xs text-black/50 dark:text-white/50">
                          {path.remaining_modules} modul belum selesai
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        {path.completed_modules} / {path.total_modules}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex min-w-36 items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10">
                            <div className="h-2 rounded-full bg-[#c81e2a]" style={{ width: `${path.progress_percentage}%` }} />
                          </div>
                          <span className="w-10 text-right text-black/50 dark:text-white/50">{path.progress_percentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{path.last_learned_at ?? '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <Button as={Link} to={path.continue_url} size="sm">
                          <PlayCircle size={16} />
                          {path.has_progress ? 'Lanjutkan belajar' : 'Mulai belajar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 p-8 text-center dark:border-white/15">
              <CheckCircle2 size={32} className="mx-auto text-black/40 dark:text-white/40" />
              <h3 className="mt-3 font-medium">Belum ada learning path yang tersedia</h3>
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                Learning path yang sesuai role kamu akan muncul di sini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

export default UserDashboardPage
