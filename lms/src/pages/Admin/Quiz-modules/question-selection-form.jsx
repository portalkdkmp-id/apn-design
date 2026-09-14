import { useMemo, useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'

export default function QuestionSelectionForm({
  module,
  learningPaths,
  questionOptions,
  onSubmit,
  onCancel,
}) {
  const [learningPathIds, setLearningPathIds] = useState(module.learning_path_ids ?? [])
  const [questionIds, setQuestionIds] = useState(module.question_ids ?? [])
  const [questionSearch, setQuestionSearch] = useState('')
  const [error, setError] = useState('')

  const toggleLearningPath = (learningPathId, checked) => {
    const nextLearningPathIds = checked
      ? [...learningPathIds, learningPathId]
      : learningPathIds.filter((id) => id !== learningPathId)

    setLearningPathIds(nextLearningPathIds)
    setQuestionIds((current) =>
      current.filter((id) => {
        const question = questionOptions.find((item) => item.id === id)
        return question !== undefined && nextLearningPathIds.includes(question.learning_path_id)
      }),
    )
  }

  const availableQuestions = useMemo(() => {
    return questionOptions.filter((question) => {
      if (!learningPathIds.includes(question.learning_path_id)) return false
      if (questionSearch.trim() === '') return true
      return question.prompt.toLowerCase().includes(questionSearch.toLowerCase())
    })
  }, [learningPathIds, questionOptions, questionSearch])

  const selectedTotalPoint = questionOptions
    .filter((question) => questionIds.includes(question.id))
    .reduce((total, question) => total + question.point, 0)

  const toggleQuestion = (questionId, checked) => {
    setQuestionIds((current) =>
      checked ? [...current, questionId] : current.filter((id) => id !== questionId),
    )
  }

  const selectAllVisibleQuestions = () => {
    setQuestionIds((current) =>
      Array.from(new Set([...current, ...availableQuestions.map((question) => question.id)])),
    )
  }

  const unselectAllVisibleQuestions = () => {
    const visibleIds = availableQuestions.map((question) => question.id)
    setQuestionIds((current) => current.filter((id) => !visibleIds.includes(id)))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (questionIds.length === 0) {
      setError('Pilih minimal satu soal untuk ujian ini.')
      return
    }

    setError('')
    onSubmit({ learning_path_ids: learningPathIds, question_ids: questionIds })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-3">
        <div>
          <div className="text-sm font-medium">Learning Path</div>
          <p className="text-sm text-black/50 dark:text-white/50">
            Pilih learning path untuk menampilkan soal yang tersedia.
          </p>
        </div>
        <div className="grid gap-3 rounded-lg border border-black/10 p-4 md:grid-cols-2 dark:border-white/15">
          {learningPaths.map((learningPath) => (
            <label
              key={learningPath.id}
              className="flex items-start gap-3 rounded-md border border-black/10 p-3 dark:border-white/15"
            >
              <Checkbox
                checked={learningPathIds.includes(learningPath.id)}
                onCheckedChange={(checked) => toggleLearningPath(learningPath.id, checked)}
              />
              <span className="text-sm font-medium">{learningPath.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Soal ujian</div>
            <p className="text-sm text-black/50 dark:text-white/50">
              {questionIds.length} soal dipilih, total {selectedTotalPoint} poin.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={selectAllVisibleQuestions}>
              Select all
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={unselectAllVisibleQuestions}>
              Unselect all
            </Button>
          </div>
        </div>

        <Input
          value={questionSearch}
          onChange={(event) => setQuestionSearch(event.target.value)}
          placeholder="Cari soal"
        />

        <div className="grid max-h-96 gap-3 overflow-y-auto rounded-lg border border-black/10 p-4 dark:border-white/15">
          {availableQuestions.map((question) => (
            <label
              key={question.id}
              className="grid gap-2 rounded-md border border-black/10 p-3 md:grid-cols-[auto_minmax(0,1fr)_auto] dark:border-white/15"
            >
              <Checkbox
                checked={questionIds.includes(question.id)}
                onCheckedChange={(checked) => toggleQuestion(question.id, checked)}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{question.prompt}</div>
                <div className="text-xs text-black/50 dark:text-white/50">
                  {question.learning_path_title} · Urutan {question.position} ·{' '}
                  {question.type === 'multiple_choice' ? 'Pilihan ganda' : 'True / False'}
                </div>
              </div>
              <div className="text-sm text-black/50 dark:text-white/50">
                {question.difficulty_name} ({question.point})
              </div>
            </label>
          ))}
          {availableQuestions.length === 0 && (
            <div className="rounded-md border border-dashed border-black/10 p-6 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
              Pilih learning path atau ubah kata kunci untuk melihat soal.
            </div>
          )}
        </div>
        <InputError message={error} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan soal ujian</Button>
      </div>
    </form>
  )
}
