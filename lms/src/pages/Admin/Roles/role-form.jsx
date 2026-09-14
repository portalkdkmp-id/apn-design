import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'

export default function RoleForm({
  initialValues = {},
  permissions = [],
  onSuccess,
  submitLabel = 'Simpan',
}) {
  const [name, setName] = useState(initialValues.name ?? '')
  const [selectedPermissions, setSelectedPermissions] = useState(
    initialValues.permissions ?? [],
  )

  const togglePermission = (permissionId) => {
    setSelectedPermissions((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId)
      }

      return [...current, permissionId]
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSuccess?.({
      name,
      permissions: selectedPermissions,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nama role
        </label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="superadmin"
          required
        />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">Permission role</CardTitle>
        </CardHeader>
        <CardContent>
          {permissions.length > 0 ? (
            <div className="grid max-h-[55vh] grid-cols-1 gap-3 overflow-y-auto pr-1">
              {permissions.map((permission) => {
                const checked = selectedPermissions.includes(permission.id)

                return (
                  <label
                    key={permission.id}
                    className="flex items-start gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10"
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => togglePermission(permission.id)}
                    />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {permission.name}
                      </div>
                      <div className="text-xs text-black/50 dark:text-white/50">
                        Akses untuk aksi {permission.name.toLowerCase()}.
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-black/50 dark:text-white/50">
              Belum ada permission. Buat permission terlebih dulu agar role
              bisa diberi akses.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
