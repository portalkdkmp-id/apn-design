import { useNavigate } from 'react-router-dom'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { ROLE_OPTIONS, DIVISION_OPTIONS } from '../../../data/learningPaths'
import LearningPathEditor from './learning-path-editor'

export default function AdminLearningPathsCreate() {
  const navigate = useNavigate()

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Superadmin', href: '/dashboard' },
        { label: 'Learning Path', href: '/admin/learning-paths' },
        { label: 'Buat' },
      ]}
    >
      <LearningPathEditor
        roles={ROLE_OPTIONS}
        divisions={DIVISION_OPTIONS}
        onSubmit={() => navigate('/admin/learning-paths')}
      />
    </AdminLayout>
  )
}
