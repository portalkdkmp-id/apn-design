import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Boxes, FolderTree, Plus, SquarePen, Trash2 } from 'lucide-react'

import { AdminLayout } from '../../../../layouts/AdminLayout'
import { Badge } from '../../../../components/ui/Badge'
import { Button } from '../../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { Modal } from '../../../../components/ui/Modal'
import { useToast } from '../../../../components/ui/Toast'
import { getLearningPathById, getModulesByLearningPathId } from '../../../../data/learningPaths'

export default function AdminLearningPathModulesIndex() {
  const { id } = useParams()
  const toast = useToast()
  const learningPath = getLearningPathById(id)
  const [modules, setModules] = useState(() => getModulesByLearningPathId(id))
  const [deletingModule, setDeletingModule] = useState(null)

  if (!learningPath) {
    return (
      <AdminLayout title="Learning path tidak ditemukan">
        <p className="text-sm text-black/50 dark:text-white/50">
          Learning path dengan id tersebut tidak ada di data dummy.
        </p>
      </AdminLayout>
    )
  }

  const moduleStats = [
    { label: 'Total Modul', value: modules.length, description: 'Seluruh modul di learning path ini.' },
    {
      label: 'Modul Utama',
      value: modules.filter((item) => !item.parent_id).length,
      description: 'Modul tanpa parent.',
    },
    {
      label: 'Submodul',
      value: modules.filter((item) => item.parent_id).length,
      description: 'Modul dengan parent.',
    },
    {
      label: 'Total Views',
      value: modules.reduce((sum, item) => sum + item.view_count, 0),
      description: 'Akumulasi dilihat peserta.',
    },
  ]

  const handleDelete = () => {
    if (!deletingModule) return
    setModules((current) => current.filter((item) => item.id !== deletingModule.id))
    toast.success(`Modul "${deletingModule.title}" berhasil dihapus.`)
    setDeletingModule(null)
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Superadmin', href: '/dashboard' },
        { label: 'Learning Path', href: '/admin/learning-paths' },
        { label: 'Modul Materi' },
      ]}
      actions={
        <>
          <Button as={Link} to={`/admin/learning-paths/${learningPath.id}/edit`} variant="outline">
            <SquarePen className="size-4" />
            Edit learning path
          </Button>
          <Button as={Link} to={`/admin/learning-paths/${learningPath.id}/modules/create`}>
            <Plus className="size-4" />
            Tambah modul
          </Button>
        </>
      }
    >
      <div className="mb-6">
        <Button as={Link} to="/admin/learning-paths" variant="ghost" className="px-0">
          <ArrowLeft className="size-4" />
          Kembali ke learning path
        </Button>
        <div className="mt-3 space-y-2">
          <Badge variant="outline">{learningPath.status}</Badge>
          <div>
            <h1 className="text-2xl font-semibold">{learningPath.title}</h1>
            <p className="text-sm text-black/50 dark:text-white/50">
              {learningPath.excerpt || 'Kelola modul materi dan hirarki parent di learning path ini.'}
            </p>
          </div>
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {moduleStats.map((stat) => (
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="size-5" />
            Daftar modul materi
          </CardTitle>
          <CardDescription>
            Modul sekarang diedit di halaman penuh supaya authoring konten lebih lega seperti editor post.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.length > 0 ? (
            <div className="grid gap-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-lg border border-black/5 p-4 shadow-xs dark:border-white/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">Urutan {module.position}</Badge>
                        <Badge variant="outline">{module.estimated_minutes} menit</Badge>
                        <Badge variant="outline">{module.view_count} views</Badge>
                        {module.parent_title ? (
                          <Badge variant="outline" className="gap-1">
                            <FolderTree className="size-3.5" />
                            Parent: {module.parent_title}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Modul utama</Badge>
                        )}
                        {module.children_count > 0 ? (
                          <Badge variant="outline">{module.children_count} submodul</Badge>
                        ) : null}
                      </div>
                      <div>
                        <div className="font-medium">{module.title}</div>
                        <div className="text-sm text-black/50 dark:text-white/50">{module.slug}</div>
                      </div>
                      <p className="text-sm text-black/50 dark:text-white/50">
                        {module.excerpt || 'Tanpa ringkasan modul.'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        to={`/admin/learning-paths/${learningPath.id}/modules/${module.id}/edit`}
                        variant="outline"
                        size="sm"
                      >
                        <SquarePen className="size-4" />
                        Ubah
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingModule(module)}>
                        <Trash2 className="size-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-black/10 px-4 py-10 text-center text-black/50 dark:border-white/15 dark:text-white/50">
              Learning path ini belum punya modul materi. Tambahkan modul pertama untuk mulai menyusun struktur belajar.
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={deletingModule !== null}
        onClose={() => setDeletingModule(null)}
        title="Hapus modul materi"
        description="Modul yang dihapus akan disembunyikan dari user. Submodul di bawahnya akan dilepas dari parent agar tetap aman."
      >
        <div className="rounded-lg border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/15 dark:bg-white/5">
          <div className="font-medium">{deletingModule?.title}</div>
          <div className="mt-1 text-black/50 dark:text-white/50">
            Tindakan ini bisa memengaruhi struktur urutan materi di learning path.
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingModule(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus modul
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
