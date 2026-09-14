import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Boxes, Save } from 'lucide-react'

import { InputError } from '../../../components/ui/InputError'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Label } from '../../../components/ui/Label'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { useToast } from '../../../components/ui/Toast'
import { AUDIENCE_TYPES, PRIORITIES, STATUSES, slugify } from '../../../data/learningPaths'

export default function LearningPathEditor({ initialValues, isEdit = false, roles, divisions, onSubmit }) {
  const toast = useToast()
  const [processing, setProcessing] = useState(false)
  const [errors] = useState({})
  const [data, setData] = useState({
    title: initialValues?.title ?? '',
    slug: initialValues?.slug ?? '',
    excerpt: initialValues?.excerpt ?? '',
    content: initialValues?.content ?? '',
    status: initialValues?.status ?? 'draft',
    priority: initialValues?.priority ?? 'optional',
    audience_type: initialValues?.audience_type ?? 'internal',
    role_ids: initialValues?.role_ids ?? [],
    division_ids: initialValues?.division_ids ?? [],
  })

  const isPublicAudience = data.audience_type === 'public'

  const setField = (field, value) => setData((current) => ({ ...current, [field]: value }))

  const toggleArrayValue = (field, id) => {
    setData((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((value) => value !== id)
        : [...current[field], id],
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setProcessing(true)
    const toastId = toast.loading('Menyimpan learning path...')

    // Simulasi request simpan (belum tersambung ke backend).
    setTimeout(() => {
      toast.dismiss(toastId)
      toast.success('Learning path berhasil disimpan.')
      setProcessing(false)
      onSubmit?.(data)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Badge variant="outline">{isEdit ? 'Edit Learning Path' : 'Learning Path Baru'}</Badge>
          <h1 className="text-2xl font-semibold">{isEdit ? 'Edit learning path' : 'Buat learning path'}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEdit && initialValues?.id ? (
            <Button as={Link} to={`/admin/learning-paths/${initialValues.id}/modules`} type="button" variant="outline">
              <Boxes className="size-4" />
              Kelola modul
            </Button>
          ) : null}
          <Button as={Link} to="/admin/learning-paths" type="button" variant="outline">
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
          <Button type="submit" disabled={processing}>
            <Save className="size-4" />
            Simpan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="grid gap-5 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul learning path</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(event) => {
                    const nextTitle = event.target.value
                    setField('title', nextTitle)
                    if (!isEdit || data.slug === '') {
                      setField('slug', slugify(nextTitle))
                    }
                  }}
                  placeholder="Onboarding keselamatan kerja"
                />
                <InputError message={errors.title} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(event) => setField('slug', slugify(event.target.value))}
                  placeholder="onboarding-keselamatan-kerja"
                />
                <InputError message={errors.slug} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={data.excerpt}
                  onChange={(event) => setField('excerpt', event.target.value)}
                  placeholder="Ringkasan singkat untuk card dan listing."
                />
                <InputError message={errors.excerpt} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Konten pembuka</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={data.content}
                  onChange={(event) => setField('content', event.target.value)}
                  placeholder="Tulis pengantar learning path di sini..."
                />
                <p className="text-xs text-black/40 dark:text-white/40">
                  Rich text editor akan dipasang saat redesign visual.
                </p>
                <InputError message={errors.content} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modul materi</CardTitle>
              <CardDescription>Modul materi dikelola di halaman terpisah, seperti alur bank soal.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-black/50 dark:text-white/50">
                {isEdit
                  ? `${initialValues?.modules_count ?? 0} modul terdaftar pada learning path ini.`
                  : 'Simpan learning path dulu, lalu tambahkan modul materi dari menu kelola modul.'}
              </div>
              {isEdit && initialValues?.id ? (
                <Button as={Link} to={`/admin/learning-paths/${initialValues.id}/modules`} variant="outline">
                  <Boxes className="size-4" />
                  Buka kelola modul
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
              <CardDescription>Atur status, prioritas, dan tipe akses seperti panel samping WordPress.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={data.status} onValueChange={(value) => setField('status', value)} options={STATUSES} />
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={data.priority}
                  onValueChange={(value) => setField('priority', value)}
                  options={PRIORITIES}
                />
              </div>

              <div className="grid gap-2">
                <Label>Akses pembelajaran</Label>
                <Select
                  value={data.audience_type}
                  onValueChange={(value) => setField('audience_type', value)}
                  options={AUDIENCE_TYPES}
                />
                <p className="text-xs text-black/40 dark:text-white/40">
                  Learning path publik dapat dibuka tanpa login dan tidak memakai segmentasi role atau divisi.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segmentasi role</CardTitle>
              <CardDescription>
                {isPublicAudience
                  ? 'Tidak digunakan untuk learning path publik.'
                  : 'Kosongkan jika learning path bisa diakses semua role.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-3 rounded-md border border-black/10 p-3 dark:border-white/15"
                >
                  <input
                    type="checkbox"
                    checked={data.role_ids.includes(role.id)}
                    disabled={isPublicAudience}
                    onChange={() => toggleArrayValue('role_ids', role.id)}
                  />
                  <span className="text-sm font-medium">{role.name}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segmentasi divisi</CardTitle>
              <CardDescription>
                {isPublicAudience
                  ? 'Tidak digunakan untuk learning path publik.'
                  : 'Kosongkan jika learning path bisa diakses semua divisi.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {divisions.map((division) => (
                <label
                  key={division.id}
                  className="flex items-center gap-3 rounded-md border border-black/10 p-3 dark:border-white/15"
                >
                  <input
                    type="checkbox"
                    checked={data.division_ids.includes(division.id)}
                    disabled={isPublicAudience}
                    onChange={() => toggleArrayValue('division_ids', division.id)}
                  />
                  <span className="text-sm font-medium">{division.name}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
