import { useNavigate, useParams } from 'react-router-dom'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { useToast } from '../../../components/ui/Toast'
import { getPermissionById } from '../../../data/adminMasterData'
import PermissionForm from './permission-form'

export default function AdminPermissionsEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const permission = getPermissionById(id)

  if (!permission) {
    return (
      <AdminLayout title="Permission tidak ditemukan">
        <p className="text-sm text-black/50 dark:text-white/50">
          Permission dengan id tersebut tidak ada di data dummy.
        </p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Ubah permission"
      breadcrumbs={[
        { label: 'Superadmin', href: '/admin/dashboard' },
        { label: 'Permission', href: '/admin/permissions' },
        { label: 'Edit' },
      ]}
    >
      <div className="max-w-xl">
        <PermissionForm
          isEdit
          initialValues={permission}
          onSubmit={() => {
            toast.success('Permission berhasil diperbarui.')
            navigate('/admin/permissions')
          }}
        />
      </div>
    </AdminLayout>
  )
}
