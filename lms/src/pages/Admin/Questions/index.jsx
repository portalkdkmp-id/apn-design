import { useMemo, useState } from 'react'
import { Download, FileQuestion, FileUp, Plus, Search, SquarePen, Trash2 } from 'lucide-react'

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
import {
  DIFFICULTIES,
  LEARNING_PATH_OPTIONS,
  QUESTIONS,
  QUESTION_STATS,
  QUESTION_TYPES,
} from '../../../data/questions'
import QuestionForm from './question-form'

const PER_PAGE = 3

const QUESTION_CARD_COLORS = {
  'Total Soal': '#c81e2a',
  'Pilihan Ganda': '#d32b36',
  'True / False': '#e9434e',
  'Learning Path': '#fa636d',
  Difficulty: '#fc7b83',
}

let nextId = QUESTIONS.length + 1
let nextOptionId = 1000

export default function AdminQuizQuestionsIndex() {
  const toast = useToast()
  const [questions, setQuestions] = useState(QUESTIONS)
  const [search, setSearch] = useState('')
  const [learningPathId, setLearningPathId] = useState('all')
  const [difficultyId, setDifficultyId] = useState('all')
  const [type, setType] = useState('all')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [deletingQuestion, setDeletingQuestion] = useState(null)
  const [importFile, setImportFile] = useState(null)
  const [importError, setImportError] = useState('')

  const filtered = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = question.prompt.toLowerCase().includes(search.toLowerCase())
      const matchesLearningPath =
        learningPathId === 'all' || String(question.learning_path_id) === learningPathId
      const matchesDifficulty =
        difficultyId === 'all' || String(question.question_difficulty_id) === difficultyId
      const matchesType = type === 'all' || question.type === type
      return matchesSearch && matchesLearningPath && matchesDifficulty && matchesType
    })
  }, [questions, search, learningPathId, difficultyId, type])

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, lastPage)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const resetFilters = () => {
    setSearch('')
    setLearningPathId('all')
    setDifficultyId('all')
    setType('all')
    setPage(1)
  }

  const decorate = (values) => {
    const learningPath = LEARNING_PATH_OPTIONS.find((path) => path.id === values.learning_path_id)
    const difficulty = DIFFICULTIES.find((item) => item.id === values.question_difficulty_id)

    return {
      ...values,
      learning_path_title: learningPath?.title ?? null,
      difficulty_name: difficulty?.name ?? null,
      difficulty_point: difficulty?.point ?? 0,
      weight: difficulty?.point ?? 0,
    }
  }

  const handleCreate = (values) => {
    const newQuestion = decorate({
      ...values,
      id: nextId++,
      options: values.options.map((option) => ({ ...option, id: nextOptionId++ })),
      created_at: 'Baru saja',
    })

    setQuestions((current) => [newQuestion, ...current])
    toast.success('Soal berhasil ditambahkan.')
    setCreateOpen(false)
  }

  const handleUpdate = (values) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === editingQuestion.id
          ? decorate({
              ...question,
              ...values,
              options: values.options.map((option) => ({
                ...option,
                id: option.id ?? nextOptionId++,
              })),
            })
          : question,
      ),
    )
    toast.success('Soal berhasil diperbarui.')
    setEditingQuestion(null)
  }

  const handleDelete = () => {
    if (!deletingQuestion) return
    setQuestions((current) => current.filter((question) => question.id !== deletingQuestion.id))
    toast.success('Soal berhasil dihapus.')
    setDeletingQuestion(null)
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
      title="Bank Soal"
      subtitle="Kelola repository soal berdasarkan Learning Path dan tingkat kesulitan."
      breadcrumbs={[{ label: 'Superadmin', href: '/dashboard' }, { label: 'Bank Soal' }]}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="size-4" />
            Import soal
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Tambah soal
          </Button>
        </div>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {QUESTION_STATS.map((stat) => (
          <Card
            key={stat.label}
            className="border-0 text-white shadow-sm"
            style={{ backgroundColor: QUESTION_CARD_COLORS[stat.label] ?? '#FF0000' }}
          >
            <CardHeader className="space-y-1">
              <CardDescription className="text-white/80">{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold text-white">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="size-5" />
            Daftar soal
          </CardTitle>
          <CardDescription>
            Soal mendukung pilihan ganda dan true / false dengan penjelasan singkat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_180px_160px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
                placeholder="Cari isi soal"
              />
            </div>
            <Select
              value={learningPathId}
              onValueChange={(value) => {
                setLearningPathId(value)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Semua Learning Path' },
                ...LEARNING_PATH_OPTIONS.map((path) => ({ value: String(path.id), label: path.title })),
              ]}
            />
            <Select
              value={difficultyId}
              onValueChange={(value) => {
                setDifficultyId(value)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Semua Difficulty' },
                ...DIFFICULTIES.map((difficulty) => ({
                  value: String(difficulty.id),
                  label: difficulty.name,
                })),
              ]}
            />
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value)
                setPage(1)
              }}
              options={[{ value: 'all', label: 'Semua Tipe' }, ...QUESTION_TYPES]}
            />
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          {paginated.length > 0 ? (
            <div className="grid gap-4">
              {paginated.map((question) => (
                <div
                  key={question.id}
                  className="rounded-lg border border-black/5 p-4 shadow-xs dark:border-white/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">Urutan {question.position}</Badge>
                        <Badge variant="outline">
                          {question.type === 'multiple_choice' ? 'Pilihan ganda' : 'True / False'}
                        </Badge>
                        <Badge variant="outline">
                          {question.difficulty_name} ({question.difficulty_point})
                        </Badge>
                        <Badge variant="outline">{question.learning_path_title ?? 'Learning path'}</Badge>
                      </div>
                      <p className="font-medium">{question.prompt}</p>
                      {question.explanation && (
                        <p className="text-sm text-black/50 dark:text-white/50">{question.explanation}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingQuestion(question)}>
                        <SquarePen className="size-4" />
                        Ubah
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingQuestion(question)}>
                        <Trash2 className="size-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 rounded-lg bg-black/[0.03] p-4 text-sm dark:bg-white/5">
                    {question.type === 'multiple_choice' ? (
                      question.options.map((option) => (
                        <div key={option.id} className="flex items-start gap-3">
                          <Badge variant={option.is_correct ? 'default' : 'outline'}>
                            {option.is_correct ? 'Benar' : 'Opsi'}
                          </Badge>
                          <span className="min-w-0 flex-1">{option.text}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge>Jawaban benar</Badge>
                        <span>{question.correct_boolean_answer ? 'Benar' : 'Salah'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-black/10 px-4 py-10 text-center text-black/50 dark:border-white/15 dark:text-white/50">
              Belum ada soal yang cocok dengan filter saat ini.
            </div>
          )}

          <PaginationNumbers currentPage={currentPage} lastPage={lastPage} onPageChange={setPage} />
        </CardContent>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah soal"
        description="Pilih tipe soal, isi pertanyaan, lalu atur jawaban benar."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <QuestionForm
            questionTypes={QUESTION_TYPES}
            learningPaths={LEARNING_PATH_OPTIONS}
            difficulties={DIFFICULTIES}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        open={editingQuestion !== null}
        onClose={() => setEditingQuestion(null)}
        title="Ubah soal"
        description="Perbarui isi pertanyaan, tipe, atau jawaban benar."
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {editingQuestion && (
            <QuestionForm
              initialValues={editingQuestion}
              questionTypes={QUESTION_TYPES}
              learningPaths={LEARNING_PATH_OPTIONS}
              difficulties={DIFFICULTIES}
              onSubmit={handleUpdate}
              onCancel={() => setEditingQuestion(null)}
              submitLabel="Perbarui soal"
            />
          )}
        </div>
      </Modal>

      <Modal
        open={deletingQuestion !== null}
        onClose={() => setDeletingQuestion(null)}
        title="Hapus soal"
        description="Soal akan dihapus dari modul ini. Riwayat attempt lama tetap aman karena memakai snapshot jawaban."
      >
        <div className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
          {deletingQuestion?.prompt}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingQuestion(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Hapus soal
          </Button>
        </div>
      </Modal>

      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import bank soal"
        description="Gunakan template CSV atau XLSX untuk menambahkan soal ke Bank Soal."
      >
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" type="button">
              <Download className="size-4" />
              Template CSV
            </Button>
            <Button variant="outline" size="sm" type="button">
              <Download className="size-4" />
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