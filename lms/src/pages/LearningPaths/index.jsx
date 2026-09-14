import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Search } from 'lucide-react'

import { MainLayout } from '../../layouts/MainLayout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { getAccessibleLearningPathsForUser } from '../../data/learningProgress'

// Mengikuti struktur `resources/js/pages/learning-paths/index.tsx` di lms_apn.
export function LearningPathsIndex() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const learningPaths = useMemo(() => getAccessibleLearningPathsForUser(user?.id, { search }), [user?.id, search])

  return (
    <MainLayout title="Materi" subtitle="Ikuti perjalanan belajar per modul dan pantau progres penyelesaiannya.">
      <div className="mb-6">
        <Badge variant="outline">Materi Belajar</Badge>
        <h2 className="mt-2 text-lg font-medium">Learning path</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar learning path</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Cari learning path" />
          </div>

          {learningPaths.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {learningPaths.map((path) => (
                <Card key={path.id}>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={path.priority === 'mandatory' ? 'default' : 'secondary'}>{path.priority}</Badge>
                      <Badge variant="outline">{path.audience_type}</Badge>
                      <Badge variant="outline">{path.modules_count} modul</Badge>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <CardDescription className="mt-2">{path.excerpt || 'Tanpa ringkasan learning path.'}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-black/50 dark:text-white/50">Progres</span>
                        <span className="font-medium">
                          {path.completed_modules_count}/{path.modules_count} modul
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
                        <div className="h-2 rounded-full bg-[#c81e2a]" style={{ width: `${path.progress_percentage}%` }} />
                      </div>
                    </div>

                    <Button as={Link} to={`/learning-paths/${path.id}`}>
                      <BookOpen size={16} />
                      Buka learning path
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 p-8 text-center text-black/50 dark:border-white/15 dark:text-white/50">
              Tidak ada learning path yang cocok dengan pencarian.
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

export default LearningPathsIndex
