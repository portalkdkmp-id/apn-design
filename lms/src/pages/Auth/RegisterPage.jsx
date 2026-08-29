import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { AuthCard } from '../../components/auth/AuthCard'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthInput } from '../../components/auth/AuthInput'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { RegionSelect } from '../../components/auth/RegionSelect'
import { AuthFooterLink } from '../../components/auth/AuthFooterLink'
import { AuthLayout } from '../../layouts/AuthLayout'
import { provinces, cities, districts, villages } from '../../data/regions'

const initialForm = {
  name: '', email: '', phone: '', province_id: '', city_id: '',
  district_id: '', village_id: '', password: '', password_confirmation: '',
}

export function RegisterPage({ dark, onToggleTheme }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const cityOptions = useMemo(() => cities[form.province_id] ?? [], [form.province_id])
  const districtOptions = useMemo(() => districts[form.city_id] ?? [], [form.city_id])
  const villageOptions = useMemo(() => villages[form.district_id] ?? [], [form.district_id])

  const update = (event) => {
    const { name, value } = event.target
    setSubmitted(false)
    setErrors((current) => ({ ...current, [name]: '' }))
    if (name === 'province_id') {
      setForm((current) => ({ ...current, province_id: value, city_id: '', district_id: '', village_id: '' }))
    } else if (name === 'city_id') {
      setForm((current) => ({ ...current, city_id: value, district_id: '', village_id: '' }))
    } else if (name === 'district_id') {
      setForm((current) => ({ ...current, district_id: value, village_id: '' }))
    } else {
      setForm((current) => ({ ...current, [name]: value }))
    }
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Nama lengkap wajib diisi.'
    if (!form.email.trim()) next.email = 'Alamat email wajib diisi.'
    if (!form.phone.trim()) next.phone = 'Nomor WhatsApp wajib diisi.'
    if (!form.province_id) next.province_id = 'Provinsi wajib dipilih.'
    if (!form.city_id) next.city_id = 'Kota/Kabupaten wajib dipilih.'
    if (!form.district_id) next.district_id = 'Kecamatan wajib dipilih.'
    if (!form.village_id) next.village_id = 'Kelurahan/Desa wajib dipilih.'
    if (!form.password) next.password = 'Kata sandi wajib diisi.'
    if (form.password !== form.password_confirmation) next.password_confirmation = 'Konfirmasi kata sandi tidak cocok.'
    setErrors(next)
    setSubmitted(Object.keys(next).length === 0)
  }

  return (
    <AuthLayout dark={dark} onToggleTheme={onToggleTheme} wide>
      <AuthCard wide>
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-xs text-[#746565] transition hover:text-[#c80008] dark:text-[#cfa0a0] dark:hover:text-red-300">
            <ArrowLeft size={15} /> Kembali ke beranda
          </a>
        </div>

        <AuthHeader title="Daftar Akun" description="Harap lengkapi data berikut sesuai KTP" />

        {submitted && <div className="mb-7 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Form siap diintegrasikan ke endpoint <strong>POST /register</strong>.</div>}

        <form onSubmit={submit} noValidate className="space-y-5">
          <AuthInput label="Nama Lengkap" name="name" value={form.name} onChange={update} placeholder="NAMA LENGKAP"autoComplete="name" error={errors.name} />
          <AuthInput label="Alamat Email" name="email" type="email" value={form.email} onChange={update} placeholder="nama@email.com" autoComplete="email" error={errors.email} />
          <AuthInput label="Nomor WhatsApp" name="phone" type="tel" value={form.phone} onChange={update} placeholder="08XXXXXXXXXX" autoComplete="tel" error={errors.phone} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <RegionSelect label="Provinsi" name="province_id" value={form.province_id} onChange={update} options={provinces} error={errors.province_id} />
            <RegionSelect label="Kota/Kabupaten" name="city_id" value={form.city_id} onChange={update} options={cityOptions} disabled={!form.province_id} error={errors.city_id} />
            <RegionSelect label="Kecamatan" name="district_id" value={form.district_id} onChange={update} options={districtOptions} disabled={!form.city_id} error={errors.district_id} />
            <RegionSelect label="Kelurahan/Desa" name="village_id" value={form.village_id} onChange={update} options={villageOptions} disabled={!form.district_id} error={errors.village_id} />
          </div>

          <PasswordInput label="Kata Sandi" name="password" type="password" value={form.password} onChange={update} placeholder="Masukkan kata sandi"autoComplete="new-password" error={errors.password} />
          <PasswordInput label="Konfirmasi Kata Sandi" name="password_confirmation" type="password" value={form.password_confirmation} onChange={update} placeholder="Ulangi kata sandi" autoComplete="new-password" error={errors.password_confirmation} />

          <button type="submit" className="mt-5 h-14 w-full rounded-[6px] bg-[#d40008] text-[16px] font-medium text-white shadow-lg shadow-red-900/10 transition hover:bg-[#b80007] focus:outline-none focus:ring-4 focus:ring-red-500/20">
            Buat Akun
          </button>
        </form>

        <AuthFooterLink prompt="Sudah punya akun?" href="/login">
         <span className="underline underline-offset-1">Masuk</span>
        </AuthFooterLink>
      </AuthCard>
    </AuthLayout>
  )
}
