import { useMemo, useState } from 'react'
import { BarChart3, History, Search } from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { PaginationNumbers } from '../../../components/ui/PaginationNumbers'
import {
  ANALYTICS_STATS,
  ANALYTICS_STATUS_OPTIONS,
  ANALYTICS_TABS,
  ATTEMPT_HISTORY,
} from '../../../data/quizAnalytics'
import { QUIZ_MODULES } from '../../../data/quizModules'

const PER_PAGE = 5

const MODULE_FILTER_OPTIONS = QUIZ_MODULES.map((module) => ({ id: module.id, title: module.title }))

export default function AdminQuizAnalyticsIndex() {
  const [tab, setTab] = useState('history')
  const [search, setSearch] = useState('')
  const [moduleTitle, setModuleTitle] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return ATTEMPT_HISTORY.filter((row) => {
      const query = search.toLowerCase()
      const matchesSearch =
        query === '' ||
        (row.user_name ?? '').toLowerCase().includes(query) ||
        (row.user_email ?? '').toLowerCase().includes(query) ||
        (row.module_title ?? '').toLowerCase().includes(query)
      const matchesModule = moduleTitle === 'all' || row.module_title === moduleTitle
      const matchesStatus = status === 'all' || row.status === status
      return matchesSearch && matchesModule && matchesStatus
    })
  }, [search, moduleTitle, status])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetFilters = () => {
    setSearch('')
    setModuleTitle('all')
    setStatus('all')
    setPage(1)
  }

  return (
    <AdminLayout
      title="Analitik tes"
      subtitle="Pantau riwayat attempt peserta, nilai, dan durasi pengerjaan."
      breadcrumbs={[{ label: 'Superadmin', href: '/dashboard' }, { label: 'Analitik Tes' }]}
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ANALYTICS_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="space-y-1">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-black/50 dark:text-white/50">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Analitik tes online
              </CardTitle>
              <CardDescription>Tab riwayat tes untuk melihat detail pengerjaan user.</CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ANALYTICS_TABS.map((item) => (
              <Button
                key={item.value}
                variant={tab === item.value ? 'default' : 'outline'}
                onClick={() => setTab(item.value)}
              >
                <History className="size-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
                placeholder="Cari user atau modul"
              />
            </div>

            <Select
              value={moduleTitle}
              onValueChange={(value) => {
                setModuleTitle(value)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Semua modul' },
                ...MODULE_FILTER_OPTIONS.map((module) => ({ value: module.title, label: module.title })),
              ]}
            />

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
              options={[{ value: 'all', label: 'Semua status' }, ...ANALYTICS_STATUS_OPTIONS]}
            />

            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Peserta</th>
                  <th className="px-4 py-3 font-medium">Modul</th>
                  <th className="px-4 py-3 font-medium">Attempt</th>
                  <th className="px-4 py-3 font-medium">Nilai</th>
                  <th className="px-4 py-3 font-medium">Durasi</th>
                  <th className="px-4 py-3 font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((row) => (
                    <tr key={row.id} className="border-t border-black/5 align-top dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{row.user_name}</div>
                        <div className="text-sm text-black/50 dark:text-white/50">{row.user_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{row.module_title}</div>
                        <Badge variant={row.passed ? 'default' : 'destructive'} className="mt-2">
                          {row.passed ? 'Lulus' : 'Belum lulus'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div>Ke-{row.attempt_number}</div>
                        <div className="mt-2">{row.status}</div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div className="font-medium text-inherit">
                          {row.score}/{row.max_score}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div>Terpakai: {row.elapsed}</div>
                        <div className="mt-2">Batas: {row.duration_minutes} menit</div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div>Mulai: {row.started_at ?? '-'}</div>
                        <div className="mt-2">Selesai: {row.submitted_at ?? '-'}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-black/50 dark:text-white/50">
                      Belum ada riwayat tes yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PaginationNumbers currentPage={currentPage} lastPage={lastPage} onPageChange={setPage} />
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
