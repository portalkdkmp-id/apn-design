import { useNavigate, useParams } from 'react-router-dom'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { ROLE_OPTIONS, DIVISION_OPTIONS, getLearningPathById } from '../../../data/learningPaths'
import LearningPathEditor from './learning-path-editor'

export default function AdminLearningPathsEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const learningPath = getLearningPathById(id)

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
        { label: 'Edit' },
      ]}
    >
      <LearningPathEditor
        isEdit
        initialValues={learningPath}
        roles={ROLE_OPTIONS}
        divisions={DIVISION_OPTIONS}
        onSubmit={() => navigate('/admin/learning-paths')}
      />
    </AdminLayout>
  )
}
