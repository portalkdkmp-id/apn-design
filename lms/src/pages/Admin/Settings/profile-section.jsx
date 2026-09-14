import { useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Label } from '../../../components/ui/Label'
import { Modal } from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'

export default function ProfileSection({ user, onUpdate }) {
  const toast = useToast()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Nama wajib diisi.'
    if (!email.trim()) nextErrors.email = 'Alamat email wajib diisi.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setTimeout(() => {
      onUpdate({ name: name.trim(), email: email.trim() })
      toast.success('Profil berhasil diperbarui.')
      setSaving(false)
    }, 300)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    if (!confirmPassword) {
      setDeleteError('Masukkan kata sandi untuk konfirmasi.')
      return
    }
    toast.success('Akun berhasil dihapus (simulasi).')
    setDeleteOpen(false)
    setConfirmPassword('')
    setDeleteError('')
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi profil</CardTitle>
          <CardDescription>Perbarui nama dan alamat email akun kamu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid max-w-md gap-5">
            <div className="grid gap-2">
              <Label htmlFor="profile_name">Nama</Label>
              <Input
                id="profile_name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama lengkap"
                required
              />
              <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile_email">Alamat email</Label>
              <Input
                id="profile_email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                required
              />
              <InputError message={errors.email} />
              {user.email_verified === false && (
                <p className="text-sm text-black/50 dark:text-white/50">
                  Email kamu belum diverifikasi.{' '}
                  <button type="button" className="text-[#c81e2a] underline underline-offset-2">
                    Kirim ulang email verifikasi.
                  </button>
                </p>
              )}
            </div>

            <div>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Hapus akun</CardTitle>
          <CardDescription>Hapus akun kamu beserta seluruh data yang terkait.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
            <p className="font-medium text-red-600 dark:text-red-300">Peringatan</p>
            <p className="mt-1 text-sm text-red-600/90 dark:text-red-200/80">
              Harap berhati-hati, tindakan ini tidak dapat dibatalkan.
            </p>
            <Button variant="destructive" className="mt-4" onClick={() => setDeleteOpen(true)}>
              Hapus akun
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setConfirmPassword('')
          setDeleteError('')
        }}
        title="Yakin ingin menghapus akun ini?"
        description="Setelah akun dihapus, seluruh data dan sumber daya terkait juga akan terhapus permanen. Masukkan kata sandi untuk mengonfirmasi."
      >
        <form onSubmit={handleDelete} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="confirm_password" className="sr-only">
              Kata sandi
            </Label>
            <Input
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Kata sandi"
            />
            <InputError message={deleteError} />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeleteOpen(false)
                setConfirmPassword('')
                setDeleteError('')
              }}
            >
              Batal
            </Button>
            <Button type="submit" variant="destructive">
              Hapus akun
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
