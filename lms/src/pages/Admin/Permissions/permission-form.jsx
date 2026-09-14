import { useState } from 'react'
import { Link } from 'react-router-dom'

import { InputError } from '../../../components/ui/InputError'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Label } from '../../../components/ui/Label'
import { normalizePermissionName } from '../../../data/adminMasterData'

export default function PermissionForm({ initialValues, isEdit = false, onSubmit }) {
  const [processing, setProcessing] = useState(false)
  const [errors] = useState({})
  const [data, setData] = useState({ name: initialValues?.name ?? '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    setProcessing(true)

    setTimeout(() => {
      setProcessing(false)
      onSubmit?.(data)
    }, 400)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama permission</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(event) => setData({ name: normalizePermissionName(event.target.value) })}
          placeholder="QUIZ.CREATE"
          required
        />
        <InputError message={errors.name} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={processing}>
          {isEdit ? 'Simpan perubahan' : 'Buat permission'}
        </Button>
        <Button as={Link} to="/admin/permissions" type="button" variant="outline">
          Batal
        </Button>
      </div>
    </form>
  )
}
