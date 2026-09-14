import { useNavigate } from 'react-router-dom'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { useToast } from '../../../components/ui/Toast'
import PermissionForm from './permission-form'

export default function AdminPermissionsCreate() {
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <AdminLayout
      title="Tambah permission"
      breadcrumbs={[
        { label: 'Superadmin', href: '/admin/dashboard' },
        { label: 'Permission', href: '/admin/permissions' },
        { label: 'Tambah' },
      ]}
    >
      <div className="max-w-xl">
        <PermissionForm
          onSubmit={() => {
            toast.success('Permission berhasil dibuat.')
            navigate('/admin/permissions')
          }}
        />
      </div>
    </AdminLayout>
  )
}
