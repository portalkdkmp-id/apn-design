import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'

import { MainLayout } from '../../../layouts/MainLayout'
import { Badge } from '../../../components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { getAttemptResultPayload } from '../../../data/quizAttempts'

export function TestAttemptResult() {
  const { attemptId } = useParams()
  const payload = useMemo(() => getAttemptResultPayload(attemptId), [attemptId])

  if (!payload) {
    return <Navigate to="/tests" replace />
  }

  const { attempt, module } = payload
  const ResultIcon = attempt.passed ? CheckCircle2 : XCircle

  return (
    <MainLayout title="Hasil Ujian">
      <section className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">Attempt #{attempt.attempt_number}</Badge>
          <Badge variant={attempt.passed ? 'success' : 'danger'}>{attempt.passed ? 'Lulus' : 'Belum lulus'}</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 dark:bg-white/10">
                <ResultIcon className={attempt.passed ? 'text-emerald-600' : 'text-[#c81e2a]'} size={22} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">Nilai</div>
              <div className="mt-2 text-3xl font-bold text-[#c81e2a]">{attempt.score}/{attempt.max_score}</div>
            </div>

            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">Status</div>
              <div className="mt-2 text-lg font-semibold">
                {attempt.passed ? 'Selamat, kamu lulus.' : `Perlu skor minimal ${attempt.passing_score}`}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">Jawaban</div>
              <div className="mt-2 text-lg font-semibold">
                {attempt.answered_count}/{attempt.question_count}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">Waktu</div>
              <div className="mt-2 text-lg font-semibold">{attempt.elapsed}</div>
            </div>
          </CardContent>

          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-black/60 dark:text-white/60">
                Dimulai: {attempt.started_at}
              </div>
              <div className="text-sm text-black/60 dark:text-white/60">
                Dikirim: {attempt.submitted_at}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  )
}

export default TestAttemptResult
