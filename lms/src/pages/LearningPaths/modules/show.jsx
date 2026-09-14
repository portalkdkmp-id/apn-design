import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Eye } from 'lucide-react'

import { MainLayout } from '../../../layouts/MainLayout'
import { LearningPathModuleSidebar } from '../../../components/learning/LearningPathModuleSidebar'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useAuth } from '../../../context/AuthContext'
import { getUserModulePayload, markModuleCompleted } from '../../../data/learningProgress'

// Mengikuti struktur `resources/js/pages/learning-paths/modules/show.tsx` di lms_apn.
export function LearningPathModuleShow() {
  const { id, moduleId } = useParams()
  const { user } = useAuth()
  const [version, setVersion] = useState(0)

  const payload = useMemo(
    () => getUserModulePayload(user?.id, id, moduleId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id, id, moduleId, version],
  )

  if (!payload) {
    return <Navigate to={`/learning-paths/${id}`} replace />
  }

  const { learningPath, module, navigation } = payload

  const handleComplete = () => {
    markModuleCompleted(user?.id, module.id)
    setVersion((v) => v + 1)
  }

  return (
    <MainLayout title={module.title}>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <LearningPathModuleSidebar learningPathId={learningPath.id} modules={learningPath.modules} activeModuleId={module.id} />

        <div className="space-y-6">
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Button as={Link} to={`/learning-paths/${learningPath.id}`} variant="ghost" className="px-0">
                <ArrowLeft size={16} />
                Kembali ke overview learning path
              </Button>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Modul {module.position}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock3 size={14} />
                    {module.estimated_minutes} menit
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Eye size={14} />
                    {module.view_count} views
                  </Badge>
                  {module.completed && (
                    <Badge className="gap-1">
                      <CheckCircle2 size={14} />
                      Selesai
                    </Badge>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{module.title}</h1>
                  <p className="mt-2 max-w-4xl text-sm text-black/50 dark:text-white/50">{module.excerpt || 'Tanpa ringkasan modul.'}</p>
                </div>
              </div>
            </div>

            <Card className="w-full max-w-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Progress materi</CardTitle>
                <CardDescription>
                  {learningPath.completed_modules_count} dari {learningPath.modules_count} modul selesai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
                  <div className="h-2 rounded-full bg-[#c81e2a]" style={{ width: `${learningPath.progress_percentage}%` }} />
                </div>
                <div className="text-sm text-black/50 dark:text-white/50">Progress {learningPath.progress_percentage}%</div>
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Isi materi</CardTitle>
              {module.completed_at && <CardDescription>Diselesaikan pada {module.completed_at}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-8">
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: module.content || '<p>Belum ada isi materi.</p>' }}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-6 dark:border-white/10">
                <div className="flex gap-2">
                  {navigation.previous_module_id && (
                    <Button
                      as={Link}
                      to={`/learning-paths/${learningPath.id}/modules/${navigation.previous_module_id}`}
                      variant="outline"
                    >
                      <ArrowLeft size={16} />
                      Modul sebelumnya
                    </Button>
                  )}
                  {navigation.next_module_id && (
                    <Button as={Link} to={`/learning-paths/${learningPath.id}/modules/${navigation.next_module_id}`} variant="outline">
                      Modul berikutnya
                      <ArrowRight size={16} />
                    </Button>
                  )}
                </div>

                <Button disabled={module.completed} onClick={handleComplete}>
                  <CheckCircle2 size={16} />
                  {module.completed ? 'Materi selesai' : 'Selesaikan materi'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default LearningPathModuleShow
