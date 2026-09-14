import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock3, Send } from 'lucide-react'

import { MainLayout } from '../../../layouts/MainLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useAuth } from '../../../context/AuthContext'
import { getAttempt, getAttemptQuestions, saveAttemptAnswers, submitAttempt } from '../../../data/quizAttempts'

function formatSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

function emptyAnswer() {
  return { selected_option_id: '', selected_boolean: '' }
}

// Mengikuti struktur `resources/js/pages/tests/attempts/show.tsx` di lms_apn
// (disederhanakan: tanpa draft localStorage terpisah karena attempt sendiri
// sudah disimpan di localStorage lewat `data/quizAttempts.js`).
export function TestAttemptShow() {
  const { attemptId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const attempt = useMemo(() => getAttempt(attemptId), [attemptId])
  const questions = useMemo(() => (attempt ? getAttemptQuestions(attempt) : []), [attempt])

  const [answers, setAnswers] = useState(() => {
    const initial = {}
    questions.forEach((question) => {
      initial[String(question.id)] = attempt?.answers?.[String(question.id)] ?? emptyAnswer()
    })
    return initial
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!attempt) return 0
    const elapsed = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
    return Math.max(0, attempt.duration_minutes * 60 - elapsed)
  })
  const autoSubmittedRef = useRef(false)

  useEffect(() => {
    if (!attempt) return
    saveAttemptAnswers(attempt.id, answers)
  }, [answers, attempt])

  const handleSubmit = useMemo(
    () => () => {
      if (!attempt || autoSubmittedRef.current) return
      autoSubmittedRef.current = true
      submitAttempt(attempt.id, answers)
      navigate(`/tests/attempts/${attempt.id}/result`, { replace: true })
    },
    [attempt, answers, navigate],
  )

  useEffect(() => {
    if (!attempt) return undefined
    if (remainingSeconds <= 0) {
      handleSubmit()
      return undefined
    }
    const interval = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [attempt, remainingSeconds, handleSubmit])

  if (!attempt || String(attempt.user_id) !== String(user?.id) || questions.length === 0) {
    return <Navigate to="/tests" replace />
  }

  if (attempt.status === 'submitted') {
    return <Navigate to={`/tests/attempts/${attempt.id}/result`} replace />
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[String(currentQuestion.id)] ?? emptyAnswer()
  const answeredCount = questions.filter((question) => {
    const answer = answers[String(question.id)]
    return answer?.selected_option_id || answer?.selected_boolean
  }).length

  const updateAnswer = (value) => {
    setAnswers((current) => ({ ...current, [String(currentQuestion.id)]: value }))
  }

  return (
    <MainLayout title={`Sesi Ujian`}>
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline">Attempt #{attempt.attempt_number}</Badge>
          <p className="text-sm text-black/50 dark:text-white/50">
            Jawab soal dengan urutan bebas. Timer sudah berjalan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Card>
            <CardContent className="flex items-center gap-3 px-4 py-3">
              <Clock3 size={18} className="text-[#c81e2a]" />
              <div>
                <div className="text-xs text-black/50 dark:text-white/50">Sisa waktu</div>
                <div className="text-lg font-semibold">{formatSeconds(remainingSeconds)}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-4 py-3">
              <div className="text-xs text-black/50 dark:text-white/50">Terjawab</div>
              <div className="text-lg font-semibold">
                {answeredCount}/{questions.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="mb-6">
        <CardHeader className="gap-4">
          <div>
            <CardTitle>Navigasi soal</CardTitle>
            <CardDescription>Pilih nomor soal mana saja. Status jawaban terlihat dari warna.</CardDescription>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {questions.map((question, index) => {
              const answer = answers[String(question.id)]
              const isAnswered = Boolean(answer?.selected_option_id || answer?.selected_boolean)
              return (
                <Button
                  key={question.id}
                  type="button"
                  size="sm"
                  variant={index === currentIndex ? 'default' : isAnswered ? 'secondary' : 'outline'}
                  className="min-w-10"
                  onClick={() => setCurrentIndex(index)}
                >
                  {isAnswered && index !== currentIndex ? <Check size={16} /> : question.position}
                </Button>
              )
            })}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Soal {currentQuestion.position}</Badge>
            <Badge variant="outline">Bobot {currentQuestion.weight}</Badge>
            <Badge variant="outline">{currentQuestion.type === 'multiple_choice' ? 'Pilihan ganda' : 'True / False'}</Badge>
          </div>
          <div>
            <div className="text-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQuestion.prompt }} />
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          {currentQuestion.type === 'multiple_choice' ? (
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-3 rounded-xl border border-black/10 p-4 transition hover:border-[#c81e2a]/40 dark:border-white/10"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={String(currentAnswer.selected_option_id) === String(option.id)}
                    onChange={() => updateAnswer({ selected_option_id: option.id, selected_boolean: '' })}
                    className="mt-1 size-4 accent-[#c81e2a]"
                  />
                  <span
                    className="min-w-0 flex-1 text-sm leading-6"
                    dangerouslySetInnerHTML={{ __html: option.text }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['true', 'Benar'],
                ['false', 'Salah'],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-3 rounded-xl border border-black/10 p-4 transition hover:border-[#c81e2a]/40 dark:border-white/10"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={currentAnswer.selected_boolean === value}
                    onChange={() => updateAnswer({ selected_option_id: '', selected_boolean: value })}
                    className="size-4 accent-[#c81e2a]"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={16} />
              Sebelumnya
            </Button>

            <div className="flex flex-wrap gap-2">
              <Button as={Link} to={`/tests/${attempt.quiz_module_id}`} variant="ghost">
                Lihat instruksi
              </Button>
              {currentIndex < questions.length - 1 ? (
                <Button type="button" onClick={() => setCurrentIndex((current) => Math.min(questions.length - 1, current + 1))}>
                  Berikutnya
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit}>
                  <Send size={16} />
                  Kirim jawaban
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}

export default TestAttemptShow
