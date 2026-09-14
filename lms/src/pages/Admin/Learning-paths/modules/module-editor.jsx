import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'

import { InputError } from '../../../../components/ui/InputError'
import { Badge } from '../../../../components/ui/Badge'
import { Button } from '../../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { Input } from '../../../../components/ui/Input'
import { Label } from '../../../../components/ui/Label'
import { Select } from '../../../../components/ui/Select'
import { Textarea } from '../../../../components/ui/Textarea'
import { useToast } from '../../../../components/ui/Toast'
import { slugify } from '../../../../data/learningPaths'

export default function ModuleEditor({ learningPath, initialValues, isEdit = false, otherModules = [], onSubmit }) {
  const toast = useToast()
  const [processing, setProcessing] = useState(false)
  const [errors] = useState({})
  const [data, setData] = useState({
    title: initialValues?.title ?? '',
    slug: initialValues?.slug ?? '',
    excerpt: initialValues?.excerpt ?? '',
    content: initialValues?.content ?? '',
    estimated_minutes: initialValues?.estimated_minutes ?? 10,
    position: initialValues?.position ?? otherModules.length + 1,
    parent_id: initialValues?.parent_id ?? '',
  })

  const setField = (field, value) => setData((current) => ({ ...current, [field]: value }))

  const parentOptions = [
    { value: '', label: 'Tidak ada (modul utama)' },
    ...otherModules
      .filter((item) => item.id !== initialValues?.id)
      .map((item) => ({ value: String(item.id), label: item.title })),
  ]

  const handleSubmit = (event) => {
    event.preventDefault()
    setProcessing(true)
    const toastId = toast.loading('Menyimpan modul materi...')

    // Simulasi request simpan (belum tersambung ke backend).
    setTimeout(() => {
      toast.dismiss(toastId)
      toast.success('Modul materi berhasil disimpan.')
      setProcessing(false)
      onSubmit?.(data)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Badge variant="outline">{isEdit ? 'Edit Modul' : 'Modul Baru'}</Badge>
          <h1 className="text-2xl font-semibold">{isEdit ? 'Edit modul materi' : 'Tambah modul materi'}</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            Learning path: <span className="font-medium">{learningPath.title}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to={`/admin/learning-paths/${learningPath.id}/modules`} type="button" variant="outline">
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
          <Button type="submit" disabled={processing}>
            <Save className="size-4" />
            Simpan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="grid gap-5 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="module-title">Judul modul</Label>
                <Input
                  id="module-title"
                  value={data.title}
                  onChange={(event) => {
                    const nextTitle = event.target.value
                    setField('title', nextTitle)
                    if (!isEdit || data.slug === '') {
                      setField('slug', slugify(nextTitle))
                    }
                  }}
                  placeholder="Pengenalan APD"
                />
                <InputError message={errors.title} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="module-slug">Slug</Label>
                <Input
                  id="module-slug"
                  value={data.slug}
                  onChange={(event) => setField('slug', slugify(event.target.value))}
                  placeholder="pengenalan-apd"
                />
                <InputError message={errors.slug} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="module-excerpt">Ringkasan</Label>
                <Textarea
                  id="module-excerpt"
                  value={data.excerpt}
                  onChange={(event) => setField('excerpt', event.target.value)}
                  placeholder="Ringkasan singkat modul untuk daftar modul."
                />
                <InputError message={errors.excerpt} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="module-content">Konten modul</Label>
                <Textarea
                  id="module-content"
                  rows={8}
                  value={data.content}
                  onChange={(event) => setField('content', event.target.value)}
                  placeholder="Tulis materi modul di sini..."
                />
                <p className="text-xs text-black/40 dark:text-white/40">
                  Rich text editor akan dipasang saat redesign visual.
                </p>
                <InputError message={errors.content} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan modul</CardTitle>
              <CardDescription>Estimasi waktu, urutan, dan posisi parent-child.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="module-minutes">Estimasi waktu (menit)</Label>
                <Input
                  id="module-minutes"
                  type="number"
                  min={1}
                  value={data.estimated_minutes}
                  onChange={(event) => setField('estimated_minutes', Number(event.target.value))}
                />
                <InputError message={errors.estimated_minutes} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="module-position">Urutan</Label>
                <Input
                  id="module-position"
                  type="number"
                  min={1}
                  value={data.position}
                  onChange={(event) => setField('position', Number(event.target.value))}
                />
                <InputError message={errors.position} />
              </div>

              <div className="grid gap-2">
                <Label>Modul parent</Label>
                <Select
                  value={data.parent_id}
                  onValueChange={(value) => setField('parent_id', value)}
                  options={parentOptions}
                />
                <p className="text-xs text-black/40 dark:text-white/40">
                  Pilih modul parent untuk membuat modul ini jadi submodul (hirarki maksimal 2 level).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
