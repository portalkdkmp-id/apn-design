import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, CircleCheckBig, FolderTree, Sparkles } from 'lucide-react'

import { MainLayout } from '../../layouts/MainLayout'
import { LearningPathModuleSidebar } from '../../components/learning/LearningPathModuleSidebar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { getUserPathPayload } from '../../data/learningProgress'

// Mengikuti struktur `resources/js/pages/learning-paths/show.tsx` di lms_apn.
export function LearningPathShow() {
  const { id } = useParams()
  const { user } = useAuth()
  const payload = useMemo(() => getUserPathPayload(user?.id, id), [user?.id, id])

  if (!payload) {
    return <Navigate to="/learning-paths" replace />
  }

  const { learningPath } = payload
  const nextModule = learningPath.modules.find((module) => !module.completed) ?? learningPath.modules[0] ?? null

  return (
    <MainLayout title={learningPath.title}>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <LearningPathModuleSidebar learningPathId={learningPath.id} modules={learningPath.modules} activeModuleId={null} />

        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{learningPath.audience_type}</Badge>
              <Badge variant={learningPath.priority === 'mandatory' ? 'default' : 'secondary'}>{learningPath.priority}</Badge>
              {learningPath.division_names.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <FolderTree size={14} />
                  {learningPath.division_names.join(', ')}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{learningPath.title}</h1>
              <p className="mt-2 max-w-4xl text-sm text-black/50 dark:text-white/50">
                {learningPath.excerpt || 'Tanpa ringkasan learning path.'}
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#c81e2a]" />
                  Pengantar learning path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: learningPath.content || '<p>Belum ada konten pengantar.</p>' }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress belajar</CardTitle>
                <CardDescription>
                  {learningPath.completed_modules_count} dari {learningPath.modules_count} modul selesai.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
                  <div className="h-2 rounded-full bg-[#c81e2a]" style={{ width: `${learningPath.progress_percentage}%` }} />
                </div>
                <div className="text-sm text-black/50 dark:text-white/50">Progress {learningPath.progress_percentage}%</div>
                {nextModule && (
                  <Button as={Link} to={`/learning-paths/${learningPath.id}/modules/${nextModule.id}`} className="w-full">
                    <BookOpen size={16} />
                    {nextModule.completed ? 'Buka materi' : 'Lanjutkan belajar'}
                    <ArrowRight size={16} />
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Modul pembelajaran</CardTitle>
              <CardDescription>Semua modul bisa dibuka langsung dari panel kiri atau dari daftar berikut.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {learningPath.modules.map((module) => (
                <div key={module.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Modul {module.position}</Badge>
                        <Badge variant="outline">{module.estimated_minutes} menit</Badge>
                        {module.completed && (
                          <Badge className="gap-1">
                            <CircleCheckBig size={14} />
                            Selesai
                          </Badge>
                        )}
                      </div>
                      <div className="font-medium">{module.title}</div>
                      <div className="text-sm text-black/50 dark:text-white/50">{module.excerpt || 'Tanpa ringkasan modul.'}</div>
                    </div>

                    <Button as={Link} to={`/learning-paths/${learningPath.id}/modules/${module.id}`}>
                      <BookOpen size={16} />
                      Buka modul
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default LearningPathShow
