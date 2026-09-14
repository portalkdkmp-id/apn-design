import { useState } from 'react'

import { InputError } from '../../../components/ui/InputError'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Label } from '../../../components/ui/Label'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { slugify } from '../../../data/adminMasterData'

// Meniru pola form.submit(...) dari useForm milik Inertia, tapi lokal (dummy).
export default function DivisionForm({ initialValues, onStart, onError, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [errors] = useState({})
  const [data, setData] = useState({
    name: initialValues?.name ?? '',
    slug: initialValues?.slug ?? '',
    description: initialValues?.description ?? '',
    is_active: initialValues?.is_active ?? true,
  })

  const setField = (field, value) => setData((current) => ({ ...current, [field]: value }))

  const onSubmit = (event) => {
    event.preventDefault()
    setProcessing(true)
    onStart?.()

    // Simulasi request simpan (belum tersambung ke backend).
    setTimeout(() => {
      setProcessing(false)
      onSuccess?.(data)
    }, 500)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama divisi</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(event) => {
            setField('name', event.target.value)
            if (!initialValues) setField('slug', slugify(event.target.value))
          }}
          placeholder="Akademik"
          required
        />
        <InputError message={errors.name} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug">Slug divisi</Label>
        <Input
          id="slug"
          value={data.slug}
          onChange={(event) => setField('slug', slugify(event.target.value))}
          placeholder="akademik"
        />
        <InputError message={errors.slug} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(event) => setField('description', event.target.value)}
          placeholder="Ringkasan fungsi divisi dan area aksesnya."
        />
        <InputError message={errors.description} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="is_active">Status</Label>
        <Select
          value={data.is_active ? 'active' : 'inactive'}
          onValueChange={(value) => setField('is_active', value === 'active')}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
        <InputError message={errors.is_active} />
      </div>

      <Button type="submit" disabled={processing}>
        Simpan divisi
      </Button>
    </form>
  )
}
