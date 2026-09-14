import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Label } from '../../../components/ui/Label'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'

const EMPTY_OPTION = () => ({ id: null, text: '', is_correct: false })

export default function QuestionForm({
  initialValues,
  questionTypes,
  learningPaths,
  difficulties,
  onSubmit,
  onCancel,
  submitLabel = 'Simpan soal',
}) {
  const [type, setType] = useState(initialValues?.type ?? 'multiple_choice')
  const [learningPathId, setLearningPathId] = useState(
    initialValues?.learning_path_id ? String(initialValues.learning_path_id) : '',
  )
  const [difficultyId, setDifficultyId] = useState(
    initialValues?.question_difficulty_id ? String(initialValues.question_difficulty_id) : '',
  )
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? '')
  const [explanation, setExplanation] = useState(initialValues?.explanation ?? '')
  const [position, setPosition] = useState(initialValues?.position ?? 1)
  const [options, setOptions] = useState(
    initialValues?.options?.length
      ? initialValues.options.map((option) => ({ ...option }))
      : [EMPTY_OPTION(), EMPTY_OPTION()],
  )
  const [booleanAnswer, setBooleanAnswer] = useState(
    initialValues?.correct_boolean_answer ?? true,
  )
  const [errors, setErrors] = useState({})

  const learningPathSelectOptions = learningPaths.map((path) => ({
    value: String(path.id),
    label: path.title,
  }))
  const difficultySelectOptions = difficulties.map((difficulty) => ({
    value: String(difficulty.id),
    label: `${difficulty.name} (${difficulty.point} poin)`,
  }))

  const updateOption = (index, patch) => {
    setOptions((current) =>
      current.map((option, currentIndex) =>
        currentIndex === index ? { ...option, ...patch } : option,
      ),
    )
  }

  const setCorrectOption = (index) => {
    setOptions((current) =>
      current.map((option, currentIndex) => ({
        ...option,
        is_correct: currentIndex === index,
      })),
    )
  }

  const addOption = () => setOptions((current) => [...current, EMPTY_OPTION()])

  const removeOption = (index) =>
    setOptions((current) => current.filter((_, currentIndex) => currentIndex !== index))

  const validate = () => {
    const nextErrors = {}

    if (!learningPathId) nextErrors.learning_path_id = 'Learning path wajib dipilih.'
    if (!difficultyId) nextErrors.question_difficulty_id = 'Tingkat kesulitan wajib dipilih.'
    if (!prompt.trim()) nextErrors.prompt = 'Pertanyaan wajib diisi.'

    if (type === 'multiple_choice') {
      const filledOptions = options.filter((option) => option.text.trim())
      if (filledOptions.length < 2) {
        nextErrors.options = 'Minimal 2 opsi jawaban harus diisi.'
      } else if (!options.some((option) => option.is_correct && option.text.trim())) {
        nextErrors.options = 'Pilih satu opsi sebagai jawaban benar.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) return

    onSubmit({
      type,
      learning_path_id: Number(learningPathId),
      question_difficulty_id: Number(difficultyId),
      prompt,
      explanation,
      position: Number(position) || 1,
      options: type === 'multiple_choice'
        ? options.filter((option) => option.text.trim())
        : [],
      correct_boolean_answer: type === 'true_false' ? booleanAnswer : null,
    })
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="type">Tipe soal</Label>
          <Select
            value={type}
            onValueChange={setType}
            options={questionTypes ?? [
              { value: 'multiple_choice', label: 'Pilihan ganda' },
              { value: 'true_false', label: 'True / False' },
            ]}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="position">Urutan</Label>
          <Input
            id="position"
            type="number"
            min={1}
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="learning_path_id">Learning Path</Label>
          <Select
            value={learningPathId}
            onValueChange={setLearningPathId}
            placeholder="Pilih learning path"
            options={learningPathSelectOptions}
          />
          <InputError message={errors.learning_path_id} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="question_difficulty_id">Tingkat kesulitan</Label>
          <Select
            value={difficultyId}
            onValueChange={setDifficultyId}
            placeholder="Pilih tingkat kesulitan"
            options={difficultySelectOptions}
          />
          <InputError message={errors.question_difficulty_id} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="prompt">Pertanyaan</Label>
        <Textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Tulis pertanyaan di sini"
        />
        <InputError message={errors.prompt} />
      </div>

      {type === 'multiple_choice' ? (
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label>Opsi jawaban</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="size-4" />
              Tambah opsi
            </Button>
          </div>

          <div className="grid gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectOption(index)}
                  aria-label="Tandai sebagai jawaban benar"
                  className={`
                    mt-2.5 size-4 shrink-0 rounded-full border-2 transition-colors
                    ${
                      option.is_correct
                        ? 'border-[#c81e2a] bg-[#c81e2a]'
                        : 'border-black/20 dark:border-white/30'
                    }
                  `}
                />
                <Input
                  value={option.text}
                  onChange={(event) => updateOption(index, { text: event.target.value })}
                  placeholder={`Opsi ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-black/40 dark:text-white/40">
            Klik lingkaran di kiri opsi untuk menandai jawaban yang benar.
          </p>
          <InputError message={errors.options} />
        </div>
      ) : (
        <div className="grid gap-2">
          <Label>Jawaban benar</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={booleanAnswer ? 'default' : 'outline'}
              onClick={() => setBooleanAnswer(true)}
            >
              Benar
            </Button>
            <Button
              type="button"
              variant={!booleanAnswer ? 'default' : 'outline'}
              onClick={() => setBooleanAnswer(false)}
            >
              Salah
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="explanation">Penjelasan (opsional)</Label>
        <Textarea
          id="explanation"
          rows={2}
          value={explanation}
          onChange={(event) => setExplanation(event.target.value)}
          placeholder="Penjelasan jawaban, tampil setelah peserta menjawab"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}