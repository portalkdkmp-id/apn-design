import { useNavigate, useParams } from 'react-router-dom'

import { AdminLayout } from '../../../../layouts/AdminLayout'
import { getLearningPathById, getModuleById, getModulesByLearningPathId } from '../../../../data/learningPaths'
import ModuleEditor from './module-editor'

export default function AdminLearningPathModulesEdit() {
  const { id, moduleId } = useParams()
  const navigate = useNavigate()
  const learningPath = getLearningPathById(id)
  const learningPathModule = getModuleById(id, moduleId)
  const otherModules = getModulesByLearningPathId(id)

  if (!learningPath || !learningPathModule) {
    return (
      <AdminLayout title="Modul tidak ditemukan">
        <p className="text-sm text-black/50 dark:text-white/50">
          Modul materi dengan id tersebut tidak ada di data dummy.
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
        { label: 'Edit Modul' },
      ]}
    >
      <ModuleEditor
        isEdit
        learningPath={learningPath}
        initialValues={learningPathModule}
        otherModules={otherModules}
        onSubmit={() => navigate(`/admin/learning-paths/${learningPath.id}/modules`)}
      />
    </AdminLayout>
  )
}
