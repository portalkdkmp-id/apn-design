import { useNavigate, useParams } from 'react-router-dom'

import { AdminLayout } from '../../../../layouts/AdminLayout'
import { getLearningPathById, getModulesByLearningPathId } from '../../../../data/learningPaths'
import ModuleEditor from './module-editor'

export default function AdminLearningPathModulesCreate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const learningPath = getLearningPathById(id)
  const otherModules = getModulesByLearningPathId(id)

  if (!learningPath) {
    return (
      <AdminLayout title="Learning path tidak ditemukan">
        <p className="text-sm text-black/50 dark:text-white/50">
          Learning path dengan id tersebut tidak ada di data dummy.
        </p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Superadmin', href: '/dashboard' },
        { label: 'Learning Path', href: '/admin/learning-paths' },
        { label: learningPath.title, href: `/admin/learning-paths/${learningPath.id}/modules` },
        { label: 'Tambah Modul' },
      ]}
    >
      <ModuleEditor
        learningPath={learningPath}
        otherModules={otherModules}
        onSubmit={() => navigate(`/admin/learning-paths/${learningPath.id}/modules`)}
      />
    </AdminLayout>
  )
}
