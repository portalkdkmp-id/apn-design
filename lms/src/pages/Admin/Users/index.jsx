import { useMemo, useState } from 'react'
import { Search, ShieldEllipsis, SquarePen, Trash2, UserPlus, UsersRound } from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { PaginationNumbers } from '../../../components/ui/PaginationNumbers'
import { useToast } from '../../../components/ui/Toast'
import { DIVISIONS, ROLES, USERS, USER_STATS } from '../../../data/users'
import UserForm from './user-form'

const PER_PAGE = 5

const USER_STAT_COLORS = {
  'Total pengguna': '#c81e2a',
  'Total guru': '#d32b36',
  'Total pelajar': '#e9434e',
  'User bulan ini': '#fa636d',
  'Sudah punya divisi': '#fc7b83',
}

let nextId = USERS.length + 1

export default function AdminUsersIndex() {
  const toast = useToast()
  const [users, setUsers] = useState(USERS)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [division, setDivision] = useState('all')
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [roleUser, setRoleUser] = useState(null)
  const [nextRole, setNextRole] = useState('')

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase()
      const matchesSearch =
        query === '' ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone ?? '').toLowerCase().includes(query)
      const matchesRole = role === 'all' || user.role === role
      const matchesDivision = division === 'all' || user.division_slug === division
      return matchesSearch && matchesRole && matchesDivision
    })
  }, [users, search, role, division])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetFilters = () => {
    setSearch('')
    setRole('all')
    setDivision('all')
    setPage(1)
  }

  const handleCreate = (values) => {
    setUsers((current) => [
      { ...values, id: nextId++, created_at: 'Baru saja' },
      ...current,
    ])
    toast.success('Pengguna berhasil dibuat.')
    setCreateOpen(false)
  }

  const handleUpdate = (values) => {
    setUsers((current) =>
      current.map((user) => (user.id === editingUser.id ? { ...user, ...values } : user)),
    )
    toast.success('Pengguna berhasil diperbarui.')
    setEditingUser(null)
  }

  const handleDelete = () => {
    if (!deletingUser) return
    setUsers((current) => current.filter((user) => user.id !== deletingUser.id))
    toast.success('Pengguna berhasil dihapus.')
    setDeletingUser(null)
  }

  const handleUpdateRole = () => {
    if (!roleUser || nextRole === '') return
    setUsers((current) =>
      current.map((user) => (user.id === roleUser.id ? { ...user, role: nextRole } : user)),
    )
    toast.success('Role pengguna berhasil diperbarui.')
    setRoleUser(null)
    setNextRole('')
  }

  return (
    <AdminLayout
      title="Kelola pengguna"
      subtitle="Semua aksi dikerjakan dari satu halaman dengan modal yang cepat dan tetap fokus."
      breadcrumbs={[{ label: 'Superadmin', href: '/dashboard' }, { label: 'Manajemen Pengguna' }]}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <UserPlus className="size-4" />
          Tambah pengguna
        </Button>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {USER_STATS.map((stat) => {
          const cardColor = USER_STAT_COLORS[stat.label] ?? '#c81e2a'

          return (
            <Card key={stat.label} style={{ borderLeft: `4px solid ${cardColor}` }}>
              <CardHeader className="space-y-1">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold text-[#1f2937] dark:text-white">{stat.value}</CardTitle>
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
            <UsersRound className="size-5" />
            Daftar pengguna
          </CardTitle>
          <CardDescription>Pagination tetap menjaga state filter dan pencarian.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
                placeholder="Cari nama, email, atau nomor HP"
              />
            </div>

            <Select
              value={role}
              onValueChange={(value) => {
                setRole(value)
                setPage(1)
              }}
              options={[{ value: 'all', label: 'Semua role' }, ...ROLES.map((item) => ({ value: item, label: item }))]}
            />

            <Select
              value={division}
              onValueChange={(value) => {
                setDivision(value)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Semua divisi' },
                ...DIVISIONS.map((item) => ({ value: item.slug, label: item.name })),
              ]}
            />

            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Kontak</th>
                  <th className="px-4 py-3 font-medium">Divisi</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Dibuat</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((user) => (
                    <tr key={user.id} className="border-t border-black/5 align-top dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-black/50 dark:text-white/50">{user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{user.phone ?? '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{user.division_name ?? 'Tanpa divisi'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{user.role ?? 'Tanpa role'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{user.created_at ?? '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRoleUser(user)
                              setNextRole(user.role ?? '')
                            }}
                          >
                            <ShieldEllipsis className="size-4" />
                            Ganti role
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                            <SquarePen className="size-4" />
                            Ubah
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingUser(user)}>
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-black/50 dark:text-white/50">
                      Belum ada data pengguna yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-black/50 dark:text-white/50">
              Menampilkan {paginated.length} dari {filtered.length} pengguna.
            </p>
            <PaginationNumbers currentPage={currentPage} lastPage={lastPage} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah pengguna"
        description="Buat akun baru tanpa meninggalkan halaman ini."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <UserForm
            key="create-user"
            roles={ROLES}
            divisions={DIVISIONS}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        open={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title="Ubah pengguna"
        description="Perbarui data akun, role, dan wilayah pengguna."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {editingUser && (
            <UserForm
              key={editingUser.id}
              isEdit
              roles={ROLES}
              divisions={DIVISIONS}
              initialValues={editingUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
              submitLabel="Simpan perubahan"
            />
          )}
        </div>
      </Modal>

      <Modal
        open={roleUser !== null}
        onClose={() => {
          setRoleUser(null)
          setNextRole('')
        }}
        title="Ganti role pengguna"
        description="Aksi ini hanya muncul untuk user login dengan role superadmin."
      >
        <div className="grid gap-4">
          <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
            <div className="font-medium">{roleUser?.name ?? '-'}</div>
            <div className="text-sm text-black/50 dark:text-white/50">{roleUser?.email ?? '-'}</div>
          </div>

          <Select
            value={nextRole}
            onValueChange={setNextRole}
            placeholder="Pilih role"
            options={ROLES.map((item) => ({ value: item, label: item }))}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRoleUser(null)
                setNextRole('')
              }}
            >
              Batal
            </Button>
            <Button
              disabled={!roleUser || nextRole === '' || nextRole === roleUser.role}
              onClick={handleUpdateRole}
            >
              <ShieldEllipsis className="size-4" />
              Simpan role
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        title="Hapus pengguna"
        description="Tindakan ini akan menghapus akun pengguna dari data aktif."
      >
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <div className="font-medium">{deletingUser?.name ?? '-'}</div>
          <div className="text-sm text-black/50 dark:text-white/50">{deletingUser?.email ?? '-'}</div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingUser(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Hapus pengguna
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
