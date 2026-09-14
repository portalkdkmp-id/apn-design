import { useMemo, useState } from 'react'
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Label } from '../../../components/ui/Label'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { PaginationNumbers } from '../../../components/ui/PaginationNumbers'
import { useToast } from '../../../components/ui/Toast'
import { DIFFICULTIES } from '../../../data/questions'

const PER_PAGE = 5

const SORT_OPTIONS = [
  { value: 'point', label: 'Point' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created' },
]

const DIRECTION_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
]

let nextId = DIFFICULTIES.length + 1

function DifficultyForm({ initialValues, onSubmit, onCancel }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [point, setPoint] = useState(initialValues?.point ?? 10)
  const [errors, setErrors] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name wajib diisi.'
    if (!point || Number(point) <= 0) nextErrors.point = 'Point harus lebih dari 0.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ name: name.trim(), point: Number(point) })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Easy"
        />
        <InputError message={errors.name} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="point">Point</Label>
        <Input
          id="point"
          type="number"
          min={1}
          value={point}
          onChange={(event) => setPoint(event.target.value)}
        />
        <InputError message={errors.point} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan difficulty</Button>
      </div>
    </form>
  )
}

export default function QuestionDifficultiesIndex() {
  const toast = useToast()
  const [difficulties, setDifficulties] = useState(DIFFICULTIES)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('point')
  const [direction, setDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingDifficulty, setEditingDifficulty] = useState(null)
  const [deletingDifficulty, setDeletingDifficulty] = useState(null)

  const filtered = useMemo(() => {
    const result = difficulties.filter((difficulty) =>
      difficulty.name.toLowerCase().includes(search.toLowerCase()),
    )

    const sorted = [...result].sort((a, b) => {
      let comparison = 0
      if (sort === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sort === 'created_at') {
        comparison = (a.created_at ?? '').localeCompare(b.created_at ?? '')
      } else {
        comparison = a.point - b.point
      }
      return direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [difficulties, search, sort, direction])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handleCreate = (values) => {
    setDifficulties((current) => [
      ...current,
      { ...values, id: nextId++, questions_count: 0, created_at: 'Baru saja' },
    ])
    toast.success('Difficulty berhasil ditambahkan.')
    setCreateOpen(false)
  }

  const handleUpdate = (values) => {
    setDifficulties((current) =>
      current.map((difficulty) =>
        difficulty.id === editingDifficulty.id ? { ...difficulty, ...values } : difficulty,
      ),
    )
    toast.success('Difficulty berhasil diperbarui.')
    setEditingDifficulty(null)
  }

  const handleDelete = () => {
    if (!deletingDifficulty) return

    if (deletingDifficulty.questions_count > 0) {
      toast.error('Difficulty yang masih dipakai soal tidak dapat dihapus.')
      setDeletingDifficulty(null)
      return
    }

    setDifficulties((current) => current.filter((item) => item.id !== deletingDifficulty.id))
    toast.success('Difficulty berhasil dihapus.')
    setDeletingDifficulty(null)
  }

  return (
    <AdminLayout
      title="Question difficulties"
      subtitle="Kelola master difficulty dan point yang dipakai seluruh soal."
      breadcrumbs={[
        { label: 'Superadmin', href: '/dashboard' },
        { label: 'Question Difficulties' },
      ]}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Tambah difficulty
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Daftar difficulty</CardTitle>
          <CardDescription>Point dari difficulty otomatis menjadi bobot soal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_160px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
                placeholder="Cari difficulty"
              />
            </div>
            <Select value={sort} onValueChange={setSort} options={SORT_OPTIONS} />
            <Select value={direction} onValueChange={setDirection} options={DIRECTION_OPTIONS} />
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setSort('point')
                setDirection('asc')
                setPage(1)
              }}
            >
              Reset
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Point</th>
                  <th className="px-4 py-3 font-medium">Soal</th>
                  <th className="px-4 py-3 font-medium">Dibuat</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((difficulty) => (
                  <tr key={difficulty.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="px-4 py-3 font-medium">{difficulty.name}</td>
                    <td className="px-4 py-3">{difficulty.point}</td>
                    <td className="px-4 py-3">{difficulty.questions_count}</td>
                    <td className="px-4 py-3 text-black/50 dark:text-white/50">
                      {difficulty.created_at ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDifficulty(difficulty)}
                        >
                          <SquarePen className="size-4" />
                          Ubah
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingDifficulty(difficulty)}
                        >
                          <Trash2 className="size-4" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-black/50 dark:text-white/50">
                      Belum ada difficulty yang cocok.
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
        title="Tambah difficulty"
        description="Isi nama dan point difficulty."
      >
        <DifficultyForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal
        open={editingDifficulty !== null}
        onClose={() => setEditingDifficulty(null)}
        title="Ubah difficulty"
        description="Perubahan point akan memengaruhi semua skor baru."
      >
        {editingDifficulty && (
          <DifficultyForm
            initialValues={editingDifficulty}
            onSubmit={handleUpdate}
            onCancel={() => setEditingDifficulty(null)}
          />
        )}
      </Modal>

      <Modal
        open={deletingDifficulty !== null}
        onClose={() => setDeletingDifficulty(null)}
        title="Hapus difficulty"
        description="Difficulty yang masih dipakai soal tidak dapat dihapus."
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingDifficulty(null)}>
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