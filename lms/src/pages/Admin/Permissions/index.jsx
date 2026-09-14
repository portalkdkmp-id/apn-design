import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, KeySquare, Search, SquarePen, Trash2 } from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useToast } from '../../../components/ui/Toast'
import { Modal } from '../../../components/ui/Modal'
import { PERMISSIONS } from '../../../data/adminMasterData'

// props: { permissions, filters } — sesuai Props di permissions/index.tsx asli.
export default function AdminPermissionsIndex() {
  const toast = useToast()
  const [permissions, setPermissions] = useState(PERMISSIONS)
  const [search, setSearch] = useState('')
  const [deletingPermission, setDeletingPermission] = useState(null)

  const filtered = useMemo(
    () => permissions.filter((permission) => permission.name.toLowerCase().includes(search.toLowerCase())),
    [permissions, search],
  )

  const resetFilters = () => setSearch('')

  const handleDelete = () => {
    if (!deletingPermission) return
    setPermissions((current) => current.filter((permission) => permission.id !== deletingPermission.id))
    toast.success('Permission berhasil dihapus.')
    setDeletingPermission(null)
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Superadmin', href: '/admin/dashboard' },
        { label: 'Permission' },
      ]}
      actions={
        <Button as={Link} to="/admin/permissions/create">
          <Plus className="size-4" />
          Tambah permission
        </Button>
      }
    >
      <section className="mb-6">
        <h1 className="text-2xl font-semibold">Kelola permission</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          Master akses untuk modul, aksi, dan fitur di LMS.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeySquare className="size-5" />
            Daftar permission
          </CardTitle>
          <CardDescription>Permission dapat digunakan di banyak role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Cari nama permission"
              />
            </div>
            <Button onClick={() => {}}>Terapkan</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Permission</th>
                  <th className="px-4 py-3 font-medium">Dipakai role</th>
                  <th className="px-4 py-3 font-medium">Dibuat</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((permission) => (
                    <tr key={permission.id} className="border-t border-black/5 align-top dark:border-white/10">
                      <td className="px-4 py-3 font-medium">
                        <Badge variant="outline">{permission.name}</Badge>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{permission.roles_count}</td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{permission.created_at ?? '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button as={Link} to={`/admin/permissions/${permission.id}/edit`} variant="outline" size="sm">
                            <SquarePen className="size-4" />
                            Ubah
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingPermission(permission)}>
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-black/50 dark:text-white/50">
                      Belum ada permission yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={deletingPermission !== null}
        onClose={() => setDeletingPermission(null)}
        title="Hapus permission"
        description="Permission yang masih dipakai role sebaiknya dilepas dulu dari role terkait."
      >
        <div className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
          {deletingPermission?.name}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingPermission(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
