import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, CheckCheck, Clock3, Play, RotateCcw, Search, Trophy } from 'lucide-react'

import { MainLayout } from '../../../layouts/MainLayout'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useAuth } from '../../../context/AuthContext'
import { getAccessibleQuizModulesForUser } from '../../../data/quizAttempts'

// Mengikuti struktur `resources/js/pages/tests/modules/index.tsx` di lms_apn.
export function TestModulesIndex() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const modules = useMemo(() => getAccessibleQuizModulesForUser(user?.id, { search }), [user?.id, search])

  return (
    <MainLayout title="Tes Saya" subtitle="Buka instruksi modul dulu, lalu mulai menjawab saat sudah siap.">
      <div className="mb-6">
        <Badge variant="outline">Tes Online</Badge>
        <h2 className="mt-2 text-lg font-medium">Daftar modul tes</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck size={20} />
            Modul tersedia
          </CardTitle>
          <CardDescription>Modul published akan muncul sesuai role peserta dan batas attempt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Cari modul tes" />
          </div>

          {modules.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{module.questions_count} soal</Badge>
                      <Badge variant="outline">Skor maksimal {module.max_score}</Badge>
                      <Badge variant="outline">Attempt tersisa {module.remaining_attempts}</Badge>
                      {module.has_completed_attempt && (
                        <Badge variant={module.latest_attempt_passed ? 'default' : 'secondary'} className="gap-1">
                          <CheckCheck size={14} />
                          Sudah dikerjakan
                        </Badge>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="mt-2">{module.description || 'Tanpa deskripsi modul.'}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 text-sm text-black/50 dark:text-white/50 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Clock3 size={16} />
                        {module.duration_minutes} menit
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy size={16} />
                        Lulus mulai {module.passing_score}
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw size={16} />
                        Maks {module.max_attempts} attempt
                      </div>
                    </div>

                    {module.latest_attempt_submitted_at && (
                      <div className="rounded-xl border border-black/10 p-3 text-sm text-black/50 dark:border-white/10 dark:text-white/50">
                        Attempt terakhir: skor{' '}
                        <span className="font-medium text-black dark:text-white">{module.latest_attempt_score}</span> pada{' '}
                        {module.latest_attempt_submitted_at}
                        {module.latest_attempt_passed !== null && (
                          <span className={`ml-1 font-semibold ${module.latest_attempt_passed ? 'text-emerald-600' : 'text-red-600'}`}>
                            ({module.latest_attempt_passed ? ' LULUS ' : ' BELUM LULUS '})
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {module.in_progress_attempt_id ? (
                        <Button as={Link} to={`/tests/attempts/${module.in_progress_attempt_id}`}>
                          <Play size={16} />
                          Lanjutkan tes
                        </Button>
                      ) : module.can_start ? (
                        <Button as={Link} to={`/tests/${module.id}`}>
                          <ArrowRight size={16} />
                          Lihat instruksi
                        </Button>
                      ) : (
                        <Button disabled>
                          <ArrowRight size={16} />
                          Attempt habis
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 p-10 text-center text-black/50 dark:border-white/15 dark:text-white/50 lg:col-span-2">
              Belum ada modul tes yang tersedia untuk role kamu.
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

export default TestModulesIndex
