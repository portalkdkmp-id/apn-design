import { useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CheckCheck, Clock3, Play, RotateCcw, ShieldCheck, Trophy } from 'lucide-react'

import { MainLayout } from '../../../layouts/MainLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useAuth } from '../../../context/AuthContext'
import { getModuleIntroPayload, startAttempt } from '../../../data/quizAttempts'

// Mengikuti struktur `resources/js/pages/tests/modules/show.tsx` di lms_apn.
export function TestModuleShow() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const payload = useMemo(() => getModuleIntroPayload(user?.id, id), [user?.id, id])

  if (!payload) {
    return <Navigate to="/tests" replace />
  }

  const { module } = payload

  const handleStart = () => {
    const attempt = startAttempt(user?.id, module.id)
    if (attempt) navigate(`/tests/attempts/${attempt.id}`)
  }

  return (
    <MainLayout title={`Instruksi - ${module.title}`}>
      <section className="mb-6 space-y-3">
        <Badge variant="outline">Instruksi Tes</Badge>
        <div>
          <h1 className="text-2xl font-semibold">{module.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-black/50 dark:text-white/50">
            {module.description || 'Baca instruksi singkat ini dulu. Waktu belum berjalan sampai kamu menekan tombol mulai menjawab.'}
          </p>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Jumlah soal</CardDescription>
            <CardTitle className="text-3xl font-semibold">{module.questions_count}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Waktu pengerjaan</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl font-semibold">
              <Clock3 size={20} />
              {module.duration_minutes}m
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Nilai lulus</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl font-semibold">
              <Trophy size={20} />
              {module.passing_score}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Attempt tersisa</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl font-semibold">
              <RotateCcw size={20} />
              {module.remaining_attempts}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Yang perlu diperhatikan</CardTitle>
            <CardDescription>Waktu baru dimulai setelah kamu masuk ke sesi menjawab.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-black/50 dark:text-white/50">
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              Soal ditampilkan per langkah. Kamu bisa lompat ke nomor soal mana saja dari navigasi di bagian atas saat mengerjakan.
            </div>
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              Jawaban bisa diubah kapan saja sebelum dikirim. Timer akan terus berjalan setelah sesi dimulai.
            </div>
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              Batas attempt untuk modul ini adalah {module.max_attempts} kali, dan saat ini kamu sudah memakai {module.attempts_used} kali.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan modul</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-black/50 dark:text-white/50">
              <ShieldCheck size={16} />
              Skor maksimal {module.max_score}
            </div>

            {module.has_completed_attempt && (
              <div className="rounded-xl border border-black/10 p-3 text-sm text-black/50 dark:border-white/10 dark:text-white/50">
                <div className="flex items-center gap-2 font-medium text-black dark:text-white">
                  <CheckCheck size={16} className="text-emerald-600" />
                  Tes ini sudah pernah kamu selesaikan
                </div>
                <div className="mt-1">
                  Skor terakhir {module.latest_attempt_score ?? '-'} pada {module.latest_attempt_submitted_at ?? '-'}.
                  {module.latest_attempt_passed !== null && (
                    <span className={module.latest_attempt_passed ? 'text-emerald-600' : 'text-red-600'}>
                      {' '}
                      {module.latest_attempt_passed ? 'Kamu lulus.' : 'Kamu belum lulus.'}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {module.in_progress_attempt_id ? (
                <Button as={Link} to={`/tests/attempts/${module.in_progress_attempt_id}`}>
                  <Play size={16} />
                  Lanjutkan menjawab
                </Button>
              ) : (
                <Button disabled={!module.can_start} onClick={handleStart}>
                  <Play size={16} />
                  {module.can_start ? 'Mulai menjawab' : 'Attempt sudah habis'}
                </Button>
              )}

              <Button as={Link} to="/tests" variant="outline">
                Kembali ke daftar
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  )
}

export default TestModuleShow

