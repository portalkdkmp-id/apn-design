import { useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Label } from '../../../components/ui/Label'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'

export default function ModuleForm({ initialValues, roles, divisions, statuses, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [startsAt, setStartsAt] = useState(initialValues?.starts_at ?? '')
  const [endsAt, setEndsAt] = useState(initialValues?.ends_at ?? '')
  const [passingScore, setPassingScore] = useState(initialValues?.passing_score ?? 70)
  const [durationMinutes, setDurationMinutes] = useState(initialValues?.duration_minutes ?? 30)
  const [maxAttempts, setMaxAttempts] = useState(initialValues?.max_attempts ?? 1)
  const [status, setStatus] = useState(initialValues?.status ?? statuses[0]?.value ?? 'draft')
  const [roleIds, setRoleIds] = useState(initialValues?.role_ids ?? [])
  const [divisionIds, setDivisionIds] = useState(initialValues?.division_ids ?? [])
  const [errors, setErrors] = useState({})

  const toggleRole = (roleId, checked) => {
    setRoleIds((current) => (checked ? [...current, roleId] : current.filter((id) => id !== roleId)))
  }

  const toggleDivision = (divisionId, checked) => {
    setDivisionIds((current) =>
      checked ? [...current, divisionId] : current.filter((id) => id !== divisionId),
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!title.trim()) nextErrors.title = 'Nama ujian wajib diisi.'
    if (!passingScore || passingScore < 1 || passingScore > 100) {
      nextErrors.passing_score = 'Nilai lulus harus antara 1 dan 100.'
    }
    if (!durationMinutes || durationMinutes < 1) nextErrors.duration_minutes = 'Durasi minimal 1 menit.'
    if (!maxAttempts || maxAttempts < 1) nextErrors.max_attempts = 'Maks attempt minimal 1.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const roleNames = roles.filter((role) => roleIds.includes(role.id)).map((role) => role.name)
    const divisionNames = divisions
      .filter((division) => divisionIds.includes(division.id))
      .map((division) => division.name)

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      starts_at: startsAt,
      ends_at: endsAt,
      starts_at_display: startsAt ? startsAt.replace('T', ' ') : null,
      ends_at_display: endsAt ? endsAt.replace('T', ' ') : null,
      passing_score: Number(passingScore),
      duration_minutes: Number(durationMinutes),
      max_attempts: Number(maxAttempts),
      status,
      role_ids: roleIds,
      role_names: roleNames,
      division_ids: divisionIds,
      division_names: divisionNames,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="title">Nama ujian</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="PHP Basic Test"
          required
        />
        <InputError message={errors.title} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Deskripsi singkat</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ringkasan tujuan ujian dan cakupan materi tes."
        />
        <InputError message={errors.description} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="starts_at">Tanggal mulai ujian</Label>
          <Input
            id="starts_at"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
          />
          <InputError message={errors.starts_at} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ends_at">Tanggal akhir ujian</Label>
          <Input
            id="ends_at"
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
          />
          <InputError message={errors.ends_at} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="passing_score">Nilai lulus (%)</Label>
          <Input
            id="passing_score"
            type="number"
            min={1}
            max={100}
            value={passingScore}
            onChange={(event) => setPassingScore(event.target.value)}
            required
          />
          <InputError message={errors.passing_score} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration_minutes">Durasi (menit)</Label>
          <Input
            id="duration_minutes"
            type="number"
            min={1}
            max={600}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
          />
          <InputError message={errors.duration_minutes} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="max_attempts">Maks attempt</Label>
          <Input
            id="max_attempts"
            type="number"
            min={1}
            max={100}
            value={maxAttempts}
            onChange={(event) => setMaxAttempts(event.target.value)}
            required
          />
          <InputError message={errors.max_attempts} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status ujian</Label>
          <Select
            value={status}
            onValueChange={setStatus}
            options={statuses.map((item) => ({ value: item.value, label: item.label }))}
          />
          <InputError message={errors.status} />
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <Label>Role peserta</Label>
          <p className="text-sm text-black/50 dark:text-white/50">
            Kosongkan jika ujian boleh diakses semua role.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg border border-black/10 p-4 md:grid-cols-2 dark:border-white/15">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-start gap-3 rounded-md border border-black/10 p-3 dark:border-white/15"
            >
              <Checkbox
                checked={roleIds.includes(role.id)}
                onCheckedChange={(checked) => toggleRole(role.id, checked)}
              />
              <div className="space-y-1">
                <div className="text-sm font-medium">{role.name}</div>
                <div className="text-xs text-black/50 dark:text-white/50">
                  Role ini akan melihat ujian pada daftar tes.
                </div>
              </div>
            </label>
          ))}
        </div>
        <InputError message={errors.role_ids} />
      </div>

      <div className="grid gap-3">
        <div>
          <Label>Divisi peserta</Label>
          <p className="text-sm text-black/50 dark:text-white/50">
            Kosongkan jika ujian boleh diakses semua divisi.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg border border-black/10 p-4 md:grid-cols-2 dark:border-white/15">
          {divisions.map((division) => (
            <label
              key={division.id}
              className="flex items-start gap-3 rounded-md border border-black/10 p-3 dark:border-white/15"
            >
              <Checkbox
                checked={divisionIds.includes(division.id)}
                onCheckedChange={(checked) => toggleDivision(division.id, checked)}
              />
              <div className="space-y-1">
                <div className="text-sm font-medium">{division.name}</div>
                <div className="text-xs text-black/50 dark:text-white/50">
                  Hanya user dari divisi ini yang bisa melihat ujian.
                </div>
              </div>
            </label>
          ))}
        </div>
        <InputError message={errors.division_ids} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan ujian</Button>
      </div>
    </form>
  )
}
