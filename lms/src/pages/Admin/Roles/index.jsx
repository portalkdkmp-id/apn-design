import { useMemo, useState } from 'react'
import { Plus, KeyRound, Search, SquarePen, Trash2 } from 'lucide-react'
import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { PERMISSIONS, ROLES } from '../../../data/adminMasterData'
import RoleForm from './role-form'

const PER_PAGE = 4

export default function AdminRolesIndex() {
  const toast = useToast()

  const [roles, setRoles] = useState(ROLES)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [deletingRole, setDeletingRole] = useState(null)

  const filtered = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = role.name
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchesSearch
    })
  }, [roles, search])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  )

  const applyFilters = () => setPage(1)
  const resetFilters = () => {
    setSearch('')
    setPage(1)
  }

  const handleCreate = (data) => {
    const newRole = {
      id: Date.now(),
      name: data.name,
      permissions: data.permissions,
      permissions_count: data.permissions.length,
      users_count: 0,
      permission_names: data.permissions.map((id) => {
        const permission = PERMISSIONS.find((item) => item.id === id)
        return permission ? permission.name : ''
      }),
      created_at: 'Baru saja',
    }

    setRoles((current) => [...current, newRole])
    toast.success('Role berhasil disimpan.')
    setCreateOpen(false)
  }

  const handleUpdate = (data) => {
    setRoles((current) =>
      current.map((role) =>
        role.id === editingRole.id
          ? {
              ...role,
              name: data.name,
              permissions: data.permissions,
              permissions_count: data.permissions.length,
              permission_names: data.permissions.map((id) => {
                const permission = PERMISSIONS.find((item) => item.id === id)
                return permission ? permission.name : ''
              }),
            }
          : role,
      ),
    )

    toast.success('Role berhasil diperbarui.')
    setEditingRole(null)
  }

  const handleDelete = () => {
    if (!deletingRole) return

    setRoles((current) =>
      current.filter((role) => role.id !== deletingRole.id),
    )

    toast.success('Role berhasil dihapus.')
    setDeletingRole(null)
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Superadmin', href: '/admin/dashboard' },
        { label: 'Role' },
      ]}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Tambah role
        </Button>
      }
    >
      <section className="mb-2">
        <h1 className="text-2xl font-semibold">Kelola role</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          Atur role dan hubungan permission dari satu halaman yang ringkas.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            Daftar role
          </CardTitle>
          <CardDescription>
            Role bisa dihubungkan ke banyak permission.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Cari nama role"
              />
            </div>
            <Button onClick={applyFilters}>Terapkan</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Permission</th>
                  <th className="px-4 py-3 font-medium">Users</th>
                  <th className="px-4 py-3 font-medium">Dibuat</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((role) => (
                    <tr
                      key={role.id}
                      className="border-t border-black/5 align-top dark:border-white/10"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{role.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="mb-2 text-black/50 dark:text-white/50">
                          {role.permissions_count} permission
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.permission_names.slice(0, 4).map((permission) => (
                            <Badge key={permission} variant="secondary">
                              {permission}
                            </Badge>
                          ))}
                          {role.permission_names.length > 4 && (
                            <Badge variant="outline">
                              +{role.permission_names.length - 4}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        {role.users_count}
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        {role.created_at ?? '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRole(role)}
                          >
                            <SquarePen className="size-4" />
                            Ubah
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingRole(role)}
                          >
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-black/50 dark:text-white/50"
                    >
                      Belum ada role yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-black/50 dark:text-white/50">
              Menampilkan {paginated.length} dari {filtered.length} role
            </span>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah role"
        description="Buat role baru dan hubungkan permission yang dibutuhkan."
      >
        <RoleForm
          permissions={PERMISSIONS}
          onSuccess={handleCreate}
          submitLabel="Buat role"
        />
      </Modal>

      <Modal
        open={editingRole !== null}
        onClose={() => setEditingRole(null)}
        title="Ubah role"
        description="Perbarui nama role dan permission yang terhubung."
      >
        {editingRole ? (
          <RoleForm
            initialValues={editingRole}
            permissions={PERMISSIONS}
            onSuccess={handleUpdate}
            submitLabel="Simpan perubahan"
          />
        ) : null}
      </Modal>

      <Modal
        open={deletingRole !== null}
        onClose={() => setDeletingRole(null)}
        title="Hapus role"
        description="Role akan dihapus dari daftar akses aktif."
      >
        <div className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
          {deletingRole?.name}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingRole(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus role
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}