import { useMemo, useState } from 'react'
import {
  BookCopy,
  Eye,
  FileQuestion,
  FileUp,
  Plus,
  Search,
  ShieldCheck,
  SquarePen,
  Timer,
  Trash2,
} from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { PaginationNumbers } from '../../../components/ui/PaginationNumbers'
import { useToast } from '../../../components/ui/Toast'
import { DIVISIONS } from '../../../data/users'
import {
  LEARNING_PATH_OPTIONS,
  MODULE_ROLE_OPTIONS,
  MODULE_STATS,
  MODULE_STATUS_OPTIONS,
  QUESTION_OPTIONS,
  QUIZ_MODULES,
} from '../../../data/quizModules'
import ModuleForm from './module-form'
import QuestionSelectionForm from './question-selection-form'

const PER_PAGE = 4

let nextId = QUIZ_MODULES.length + 1

export default function AdminQuizModulesIndex() {
  const toast = useToast()
  const [modules, setModules] = useState(QUIZ_MODULES)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [questionModule, setQuestionModule] = useState(null)
  const [detailModule, setDetailModule] = useState(null)
  const [deletingModule, setDeletingModule] = useState(null)
  const [importFile, setImportFile] = useState(null)
  const [importError, setImportError] = useState('')

  const filtered = useMemo(() => {
    return modules.filter((module) => {
      const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || module.status === status
      return matchesSearch && matchesStatus
    })
  }, [modules, search, status])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
    setPage(1)
  }

  const decorateFromQuestions = (questionIds) => {
    const selected = QUESTION_OPTIONS.filter((question) => questionIds.includes(question.id))
    return {
      questions_count: selected.length,
      max_score: selected.reduce((total, question) => total + question.point, 0),
    }
  }

  const handleCreate = (values) => {
    const derived = decorateFromQuestions([])
    setModules((current) => [
      {
        ...values,
        id: nextId++,
        learning_path_ids: [],
        learning_path_names: [],
        question_ids: [],
        ...derived,
        attempts_count: 0,
        minimum_passing_point: Math.ceil((derived.max_score * values.passing_score) / 100),
        created_at: 'Baru saja',
      },
      ...current,
    ])
    toast.success('Ujian berhasil dibuat.')
    setCreateOpen(false)
  }

  const handleUpdate = (values) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== editingModule.id) return module
        const minimumPassingPoint = Math.ceil((module.max_score * values.passing_score) / 100)
        return { ...module, ...values, minimum_passing_point: minimumPassingPoint }
      }),
    )
    toast.success('Ujian berhasil diperbarui.')
    setEditingModule(null)
  }

  const handleSyncQuestions = ({ learning_path_ids: learningPathIds, question_ids: questionIds }) => {
    const learningPathNames = LEARNING_PATH_OPTIONS.filter((path) => learningPathIds.includes(path.id)).map(
      (path) => path.title,
    )
    const derived = decorateFromQuestions(questionIds)

    setModules((current) =>
      current.map((module) => {
        if (module.id !== questionModule.id) return module
        const minimumPassingPoint = Math.ceil((derived.max_score * module.passing_score) / 100)
        return {
          ...module,
          learning_path_ids: learningPathIds,
          learning_path_names: learningPathNames,
          question_ids: questionIds,
          ...derived,
          minimum_passing_point: minimumPassingPoint,
        }
      }),
    )
    toast.success('Soal ujian berhasil diperbarui.')
    setQuestionModule(null)
  }

  const handleDelete = () => {
    if (!deletingModule) return
    setModules((current) => current.filter((module) => module.id !== deletingModule.id))
    toast.success('Ujian berhasil dihapus.')
    setDeletingModule(null)
  }

  const handleImport = () => {
    if (!importFile) {
      setImportError('Pilih file import terlebih dahulu.')
      return
    }

    toast.success(`File "${importFile.name}" berhasil diimport (simulasi).`)
    setImportOpen(false)
    setImportFile(null)
    setImportError('')
  }

  return (
    <AdminLayout
      title="Manajemen ujian"
      subtitle="Kelola ujian, learning path sumber soal, pilihan soal, durasi, dan segmentasi peserta."
      breadcrumbs={[{ label: 'Superadmin', href: '/dashboard' }, { label: 'Manajemen Ujian' }]}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="size-4" />
            Import ujian
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <BookCopy className="size-4" />
            Tambah ujian
          </Button>
        </div>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MODULE_STATS.map((stat) => (
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
            <FileQuestion className="size-5" />
            Daftar ujian
          </CardTitle>
          <CardDescription>Ujian memilih soal dari Bank Soal tanpa membuat salinan pertanyaan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
                placeholder="Cari nama ujian"
              />
            </div>

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
              options={[{ value: 'all', label: 'Semua status' }, ...MODULE_STATUS_OPTIONS]}
            />

            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Ujian</th>
                  <th className="px-4 py-3 font-medium">Konfigurasi</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Divisi</th>
                  <th className="px-4 py-3 font-medium">Aktivitas</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((module) => (
                    <tr key={module.id} className="border-t border-black/5 align-top dark:border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{module.title}</div>
                        <div className="mt-1 text-black/50 dark:text-white/50">
                          {module.description || 'Tanpa deskripsi'}
                        </div>
                        <div className="mt-3">
                          <Badge variant={module.status === 'published' ? 'default' : 'secondary'}>
                            {module.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div className="flex items-center gap-2">
                          <Timer className="size-4" />
                          Durasi: {module.duration_minutes} menit
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <ShieldCheck className="size-4" />
                          Nilai lulus: {module.passing_score}%
                        </div>
                        <div className="mt-2">Total poin: {module.max_score}</div>
                        <div className="mt-2">Minimal lulus: {module.minimum_passing_point}</div>
                        <div className="mt-2">Maks attempt: {module.max_attempts}</div>
                        <div className="mt-2">Mulai: {module.starts_at_display ?? '-'}</div>
                        <div className="mt-2">Akhir: {module.ends_at_display ?? '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {module.role_names.length > 0 ? (
                            module.role_names.map((roleName) => (
                              <Badge key={roleName} variant="secondary">
                                {roleName}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">Semua role</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {module.division_names.length > 0 ? (
                            module.division_names.map((divisionName) => (
                              <Badge key={divisionName} variant="outline">
                                {divisionName}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">Semua divisi</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">
                        <div>{module.questions_count} soal</div>
                        <div className="mt-2">{module.attempts_count} attempt</div>
                        <div className="mt-2">{module.created_at ?? '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailModule(module)}>
                            <Eye className="size-4" />
                            Detail
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setQuestionModule(module)}>
                            <Plus className="size-4" />
                            Soal
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingModule(module)}>
                            <SquarePen className="size-4" />
                            Ubah
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingModule(module)}>
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-black/50 dark:text-white/50">
                      Belum ada ujian yang cocok dengan filter saat ini.
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
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah ujian"
        description="Buat detail ujian terlebih dahulu. Soal dapat ditambahkan setelah ujian tersimpan."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <ModuleForm
            roles={MODULE_ROLE_OPTIONS}
            divisions={DIVISIONS}
            statuses={MODULE_STATUS_OPTIONS}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        open={editingModule !== null}
        onClose={() => setEditingModule(null)}
        title="Ubah ujian"
        description="Perbarui detail ujian tanpa mengubah pilihan soal."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {editingModule && (
            <ModuleForm
              key={editingModule.id}
              initialValues={editingModule}
              roles={MODULE_ROLE_OPTIONS}
              divisions={DIVISIONS}
              statuses={MODULE_STATUS_OPTIONS}
              onSubmit={handleUpdate}
              onCancel={() => setEditingModule(null)}
            />
          )}
        </div>
      </Modal>

      <Modal
        open={questionModule !== null}
        onClose={() => setQuestionModule(null)}
        title="Tambah soal ujian"
        description="Pilih learning path, lalu checklist soal yang akan digunakan."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {questionModule && (
            <QuestionSelectionForm
              key={questionModule.id}
              module={questionModule}
              learningPaths={LEARNING_PATH_OPTIONS}
              questionOptions={QUESTION_OPTIONS}
              onSubmit={handleSyncQuestions}
              onCancel={() => setQuestionModule(null)}
            />
          )}
        </div>
      </Modal>

      <Modal
        open={detailModule !== null}
        onClose={() => setDetailModule(null)}
        title="Detail ujian"
        description="Ringkasan jadwal, soal, dan batas kelulusan ujian."
      >
        {detailModule && (
          <div className="grid gap-4">
            <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
              <div className="font-medium">{detailModule.title}</div>
              <div className="mt-1 text-sm text-black/50 dark:text-white/50">
                {detailModule.description || 'Tanpa deskripsi'}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <div className="text-sm text-black/50 dark:text-white/50">Tanggal mulai</div>
                <div className="mt-1 font-medium">{detailModule.starts_at_display ?? '-'}</div>
              </div>
              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <div className="text-sm text-black/50 dark:text-white/50">Tanggal akhir</div>
                <div className="mt-1 font-medium">{detailModule.ends_at_display ?? '-'}</div>
              </div>
              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <div className="text-sm text-black/50 dark:text-white/50">Jumlah soal</div>
                <div className="mt-1 font-medium">{detailModule.questions_count}</div>
              </div>
              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <div className="text-sm text-black/50 dark:text-white/50">Total poin</div>
                <div className="mt-1 font-medium">{detailModule.max_score}</div>
              </div>
              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <div className="text-sm text-black/50 dark:text-white/50">Nilai lulus</div>
                <div className="mt-1 font-medium">{detailModule.passing_score}%</div>
              </div>
              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <div className="text-sm text-black/50 dark:text-white/50">Minimal poin lulus</div>
                <div className="mt-1 font-medium">{detailModule.minimum_passing_point}</div>
              </div>
            </div>

            <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
              <div className="text-sm text-black/50 dark:text-white/50">Learning Path</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {detailModule.learning_path_names.length > 0 ? (
                  detailModule.learning_path_names.map((name) => (
                    <Badge key={name} variant="outline">
                      {name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-black/50 dark:text-white/50">Belum ada learning path.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={deletingModule !== null}
        onClose={() => setDeletingModule(null)}
        title="Hapus ujian"
        description="Ujian dan seluruh riwayat attempt di dalamnya akan ikut terhapus."
      >
        <div className="grid gap-4">
          <div className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
            {deletingModule?.title}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingModule(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4" />
              Hapus ujian
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import ujian"
        description="Upload file CSV atau XLSX berdasarkan template yang disediakan."
      >
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" type="button">
              Template CSV
            </Button>
            <Button variant="outline" size="sm" type="button">
              Template XLSX
            </Button>
          </div>

          <div className="grid gap-2">
            <Input
              type="file"
              accept=".csv,.txt,.xlsx"
              onChange={(event) => {
                setImportError('')
                setImportFile(event.target.files?.[0] ?? null)
              }}
            />
            <InputError message={importError} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleImport}>Import sekarang</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}
