import { useMemo, useState } from 'react'
import { Plus, FolderKanban, Search, SquarePen, Trash2 } from 'lucide-react'
import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { PaginationNumbers } from '../../../components/ui/PaginationNumbers'
import { useToast } from '../../../components/ui/Toast'
import { DIVISIONS, DIVISION_STATS, DIVISION_STATUSES } from '../../../data/adminMasterData'
import DivisionForm from './divisions-form'

const PER_PAGE = 4

const DIVISIONS_CARD_COLORS = {
  'Total Divisi': '#c81e2a',
  'Divisi Aktif': '#d32b36',
  'Total User': '#e9434e',
  'Modul Tes Terbatas': '#fa636d',
}

// props: { divisions, stats, statuses, filters } — sesuai Props di divisions/index.tsx asli.
export default function AdminDivisionsIndex() {
  const toast = useToast()
  const [divisions, setDivisions] = useState(DIVISIONS)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingDivision, setEditingDivision] = useState(null)
  const [deletingDivision, setDeletingDivision] = useState(null)

  const filtered = useMemo(() => {
    return divisions.filter((division) => {
      const matchesSearch =
        division.name.toLowerCase().includes(search.toLowerCase()) ||
        division.slug.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        status === 'all' || (status === 'active' ? division.is_active : !division.is_active)
      return matchesSearch && matchesStatus
    })
  }, [divisions, search, status])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const applyFilters = () => setPage(1)
  const resetFilters = () => {
    setSearch('')
    setStatus('all')
    setPage(1)
  }

  const handleCreate = (data) => {
    setDivisions((current) => [
      ...current,
      { id: Date.now(), users_count: 0, quiz_modules_count: 0, created_at: 'Baru saja', ...data },
    ])
    toast.success('Divisi berhasil disimpan.')
    setCreateOpen(false)
  }

  const handleUpdate = (data) => {
    setDivisions((current) =>
      current.map((division) => (division.id === editingDivision.id ? { ...division, ...data } : division)),
    )
    toast.success('Divisi berhasil diperbarui.')
    setEditingDivision(null)
  }

  const handleDelete = () => {
    if (!deletingDivision) return
    setDivisions((current) => current.filter((division) => division.id !== deletingDivision.id))
    toast.success('Divisi berhasil dihapus.')
    setDeletingDivision(null)
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Superadmin', href: '/admin/dashboard' },
        { label: 'Divisi' },
      ]}
      actions={
      <Button onClick={() => setCreateOpen(true)}> 
        <Plus className="size-4" />
        Tambah divisi
        </Button>
        }
    >
      <section className="mb-2">
        <h1 className="text-2xl font-semibold">Kelola divisi</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          Atur segmentasi user dan modul tes berdasarkan divisi dari satu halaman.
        </p>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DIVISION_STATS.map((stat) => {
          const cardColor = DIVISIONS_CARD_COLORS[stat.label] ?? '#c81e2a'

          return (
            <Card
              key={stat.label}
              style={{
                borderLeft: `4px solid ${cardColor}`,
              }}
            >
              <CardHeader className="space-y-1">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-black/50 dark:text-white/50">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="size-5" />
            Daftar divisi
          </CardTitle>
          <CardDescription>
            Divisi aktif bisa dipakai untuk user assignment dan pembatasan modul tes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Cari nama atau slug divisi"
              />
            </div>
            <Select
              value={status}
              onValueChange={setStatus}
              options={[{ value: 'all', label: 'Semua status' }, ...DIVISION_STATUSES]}
            />
            <Button onClick={applyFilters}>Terapkan</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Divisi</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Relasi</th>
                  <th className="px-4 py-3 font-medium">Dibuat</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((division) => (
                    <tr key={division.id} className="border-t border-black/5 align-top dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{division.name}</div>
                        <div className="text-sm text-black/50 dark:text-white/50">{division.slug}</div>
                        {division.description ? (
                          <p className="mt-1 text-sm text-black/50 dark:text-white/50">{division.description}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={division.is_active ? 'default' : 'secondary'}>
                          {division.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div>{division.users_count} user</div>
                        <div className="mt-2">{division.quiz_modules_count} modul tes</div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{division.created_at ?? '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingDivision(division)}>
                            <SquarePen className="size-4" />
                            Ubah
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingDivision(division)}>
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
                      Belum ada divisi yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PaginationNumbers currentPage={currentPage} lastPage={lastPage} onPageChange={setPage} />
        </CardContent>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah divisi" description="Buat divisi baru untuk segmentasi user dan modul tes.">
        <DivisionForm onSuccess={handleCreate} />
      </Modal>

      <Modal open={editingDivision !== null} onClose={() => setEditingDivision(null)} title="Ubah divisi" description="Perbarui metadata divisi tanpa pindah halaman.">
        {editingDivision ? <DivisionForm initialValues={editingDivision} onSuccess={handleUpdate} /> : null}
      </Modal>

      <Modal
        open={deletingDivision !== null}
        onClose={() => setDeletingDivision(null)}
        title="Hapus divisi"
        description="Assignment user dan pembatasan modul untuk divisi ini ikut dilepas."
      >
        <div className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
          {deletingDivision?.name}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingDivision(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus divisi
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
