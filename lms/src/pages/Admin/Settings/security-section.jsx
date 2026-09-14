import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Label } from '../../../components/ui/Label'
import { Modal } from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { RECOVERY_CODES } from '../../../data/settings'

export default function SecuritySection({ security, onUpdateSecurity }) {
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [setupOpen, setSetupOpen] = useState(false)
  const [setupCode, setSetupCode] = useState('')
  const [setupError, setSetupError] = useState('')
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)

  const handlePasswordSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!currentPassword) nextErrors.current_password = 'Kata sandi saat ini wajib diisi.'
    if (!password) nextErrors.password = 'Kata sandi baru wajib diisi.'
    if (password.length > 0 && password.length < 8) {
      nextErrors.password = 'Kata sandi baru minimal 8 karakter.'
    }
    if (password !== passwordConfirmation) {
      nextErrors.password_confirmation = 'Konfirmasi kata sandi tidak cocok.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setTimeout(() => {
      toast.success('Kata sandi berhasil diperbarui.')
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
      setSaving(false)
    }, 300)
  }

  const handleEnable2FA = () => {
    setSetupOpen(true)
    setSetupCode('')
    setSetupError('')
  }

  const handleConfirmSetup = (event) => {
    event.preventDefault()
    if (setupCode.trim().length !== 6) {
      setSetupError('Masukkan kode 6 digit dari aplikasi autentikator kamu.')
      return
    }
    onUpdateSecurity({ two_factor_enabled: true })
    toast.success('Two-factor authentication berhasil diaktifkan.')
    setSetupOpen(false)
    setShowRecoveryCodes(true)
  }

  const handleDisable2FA = () => {
    onUpdateSecurity({ two_factor_enabled: false })
    setShowRecoveryCodes(false)
    toast.success('Two-factor authentication dinonaktifkan.')
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ubah kata sandi</CardTitle>
          <CardDescription>
            Pastikan akun kamu menggunakan kata sandi yang panjang dan acak agar tetap aman.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="grid max-w-md gap-5">
            <div className="grid gap-2">
              <Label htmlFor="current_password">Kata sandi saat ini</Label>
              <Input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Kata sandi saat ini"
              />
              <InputError message={errors.current_password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new_password">Kata sandi baru</Label>
              <Input
                id="new_password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Kata sandi baru"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new_password_confirmation">Konfirmasi kata sandi</Label>
              <Input
                id="new_password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                placeholder="Konfirmasi kata sandi baru"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <div>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan kata sandi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autentikasi dua faktor</CardTitle>
          <CardDescription>Kelola pengaturan autentikasi dua faktor untuk akun kamu.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {security.two_factor_enabled ? (
            <div className="grid gap-4">
              <p className="text-sm text-black/60 dark:text-white/60">
                Kamu akan diminta memasukkan pin dari aplikasi autentikator setiap kali login.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="destructive" onClick={handleDisable2FA}>
                  Nonaktifkan 2FA
                </Button>
                <Button variant="outline" onClick={() => setShowRecoveryCodes((value) => !value)}>
                  {showRecoveryCodes ? 'Sembunyikan kode pemulihan' : 'Lihat kode pemulihan'}
                </Button>
              </div>

              {showRecoveryCodes && (
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-black/10 p-4 font-mono text-sm md:grid-cols-3 dark:border-white/15">
                  {RECOVERY_CODES.map((code) => (
                    <span key={code}>{code}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-black/60 dark:text-white/60">
                Saat kamu mengaktifkan autentikasi dua faktor, kamu akan diminta memasukkan pin aman
                setiap login. Pin ini didapat dari aplikasi autentikator di ponsel kamu.
              </p>
              <div>
                <Button onClick={handleEnable2FA}>
                  <ShieldCheck className="size-4" />
                  Aktifkan 2FA
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        title="Aktifkan autentikasi dua faktor"
        description="Pindai QR berikut dengan aplikasi autentikator, lalu masukkan kode 6 digit untuk konfirmasi."
      >
        <form onSubmit={handleConfirmSetup} className="grid gap-4">
          <div className="grid place-items-center gap-3 rounded-lg border border-dashed border-black/15 p-6 dark:border-white/20">
            <div className="grid size-36 place-items-center rounded-md bg-black/5 text-xs text-black/40 dark:bg-white/10 dark:text-white/40">
              QR Code
            </div>
            <p className="break-all text-center text-xs text-black/50 dark:text-white/50">
              Kunci manual: APN-KMP-XXXX-XXXX-XXXX
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="setup_code">Kode konfirmasi</Label>
            <Input
              id="setup_code"
              value={setupCode}
              onChange={(event) => setSetupCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
            />
            <InputError message={setupError} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setSetupOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Konfirmasi & aktifkan</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
