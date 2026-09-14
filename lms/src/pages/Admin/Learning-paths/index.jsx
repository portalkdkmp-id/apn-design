import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Boxes, Plus, Search, SquarePen, Trash2 } from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { PaginationNumbers } from '../../../components/ui/PaginationNumbers'
import { useToast } from '../../../components/ui/Toast'
import { LEARNING_PATHS, LEARNING_PATH_STATS, STATUSES } from '../../../data/learningPaths'

const PER_PAGE = 3

const LEARNING_PATH_CARD_COLORS = {
  'Total Learning Path': '#c81e2a',
  Published: '#d32b36',
  Draft: '#e9434e',
  'Total Modul': '#fa636d',
}

export default function AdminLearningPathsIndex() {
  const toast = useToast()
  const [learningPaths, setLearningPaths] = useState(LEARNING_PATHS)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [deletingPath, setDeletingPath] = useState(null)

  const filtered = useMemo(() => {
    return learningPaths.filter((path) => {
      const matchesSearch = path.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || path.status === status
      return matchesSearch && matchesStatus
    })
  }, [learningPaths, search, status])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handleReset = () => {
    setSearch('')
    setStatus('all')
    setPage(1)
  }

  const handleDelete = () => {
    if (!deletingPath) return
    setLearningPaths((current) => current.filter((path) => path.id !== deletingPath.id))
    toast.success(`"${deletingPath.title}" berhasil dihapus.`)
    setDeletingPath(null)
  }

  return (
    <AdminLayout
      title="Learning Path"
      subtitle="Kelola perjalanan belajar, modul materi, dan segmentasi akses."
      breadcrumbs={[{ label: 'Superadmin', href: '/dashboard' }, { label: 'Learning Path' }]}
      actions={
        <Button as={Link} to="/admin/learning-paths/create">
          <Plus className="size-4" />
          Tambah learning path
        </Button>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {LEARNING_PATH_STATS.map((stat) => (
          <Card
            key={stat.label}
            className="border-0 text-white shadow-sm"
            style={{ backgroundColor: LEARNING_PATH_CARD_COLORS[stat.label] ?? '#FF0000' }}
          >
            <CardHeader className="space-y-1">
              <CardDescription className="text-white" style={{ color: '#ffffff' }}>{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold text-white" style={{ color: '#ffffff' }}>{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white dark:text-white" style={{ color: '#ffffff' }}>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5" />
            Daftar learning path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
                placeholder="Cari judul learning path"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
              options={[{ value: 'all', label: 'Semua status' }, ...STATUSES]}
            />
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div />
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5 ">
                <tr>
                  <th className="px-4 py-3 font-medium">Judul</th>
                  <th className="px-4 py-3 font-medium">Akses</th>
                  <th className="px-4 py-3 font-medium">Modul</th>
                  <th className="px-4 py-3 font-medium">Terbit</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((path) => (
                    <tr key={path.id} className="border-t border-black/5 align-top dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{path.title}</div>
                        <div className="text-sm text-black/50 dark:text-white/50">{path.slug}</div>
                        <div className="mt-2 text-sm text-black/50 dark:text-white/50">
                          {path.excerpt || 'Tanpa ringkasan'}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant={path.status === 'published' ? 'default' : 'secondary'}>
                            {path.status}
                          </Badge>
                          <Badge variant="outline">{path.priority}</Badge>
                          <Badge variant="outline">{path.audience_type}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {path.role_names.length > 0 ? (
                            path.role_names.map((roleName) => (
                              <Badge key={roleName} variant="secondary">
                                {roleName}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">Semua role</Badge>
                          )}
                          {path.division_names.length > 0 ? (
                            path.division_names.map((divisionName) => (
                              <Badge key={divisionName} variant="outline">
                                {divisionName}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">Semua divisi</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{path.modules_count} modul</td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        {path.published_at ?? path.created_at ?? '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button as={Link} to={`/admin/learning-paths/${path.id}/modules`} variant="outline" size="sm">
                            <Boxes className="size-4" />
                            Modul
                          </Button>
                          <Button as={Link} to={`/admin/learning-paths/${path.id}/edit`} variant="outline" size="sm">
                            <SquarePen className="size-4" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingPath(path)}>
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-black/50 dark:text-white/50">
                      Belum ada learning path yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PaginationNumbers currentPage={currentPage} lastPage={lastPage} onPageChange={setPage} />
        </CardContent>
      </Card>

      <Modal
        open={deletingPath !== null}
        onClose={() => setDeletingPath(null)}
        title="Hapus learning path"
        description="Learning path akan masuk status deleted dan di-soft delete."
      >
        <div className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
          {deletingPath?.title}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingPath(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Hapus
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
