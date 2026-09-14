import { useMemo, useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { InputError } from '../../../components/ui/InputError'
import { Label } from '../../../components/ui/Label'
import { Select } from '../../../components/ui/Select'
import { cities, districts, provinces, villages } from '../../../data/regions'

function normalizeName(value) {
  return value
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s{2,}/g, ' ')
    .toUpperCase()
}

function normalizePhone(value) {
  let digits = value.replace(/\D/g, '')

  if (digits.startsWith('8')) {
    digits = `0${digits}`
  }

  if (digits !== '' && !digits.startsWith('0')) {
    return ''
  }

  if (digits.length > 1 && digits[0] === '0' && digits[1] !== '8') {
    return '0'
  }

  return digits.slice(0, 13)
}

export default function UserForm({
  initialValues,
  isEdit = false,
  roles,
  divisions,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [email, setEmail] = useState(initialValues?.email ?? '')
  const [phone, setPhone] = useState(initialValues?.phone ?? '')
  const [role, setRole] = useState(initialValues?.role ?? '')
  const [divisionId, setDivisionId] = useState(
    initialValues?.division_id && initialValues.division_id !== '' ? initialValues.division_id : 'none',
  )
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [provinceId, setProvinceId] = useState(initialValues?.province_id ?? '')
  const [cityId, setCityId] = useState(initialValues?.city_id ?? '')
  const [districtId, setDistrictId] = useState(initialValues?.district_id ?? '')
  const [villageId, setVillageId] = useState(initialValues?.village_id ?? '')

  const [errors, setErrors] = useState({})

  const cityOptions = useMemo(() => cities[provinceId] ?? [], [provinceId])
  const districtOptions = useMemo(() => districts[cityId] ?? [], [cityId])
  const villageOptions = useMemo(() => villages[districtId] ?? [], [districtId])

  const handleProvinceChange = (value) => {
    setProvinceId(value)
    setCityId('')
    setDistrictId('')
    setVillageId('')
  }

  const handleCityChange = (value) => {
    setCityId(value)
    setDistrictId('')
    setVillageId('')
  }

  const handleDistrictChange = (value) => {
    setDistrictId(value)
    setVillageId('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Nama lengkap wajib diisi.'
    if (!email.trim()) nextErrors.email = 'Alamat email wajib diisi.'
    if (!phone.trim()) nextErrors.phone = 'Nomor handphone wajib diisi.'
    if (!role) nextErrors.role = 'Role wajib dipilih.'
    if (!provinceId) nextErrors.province_id = 'Provinsi wajib dipilih.'
    if (!cityId) nextErrors.city_id = 'Kota / kabupaten wajib dipilih.'
    if (!districtId) nextErrors.district_id = 'Kecamatan wajib dipilih.'
    if (!villageId) nextErrors.village_id = 'Kelurahan / desa wajib dipilih.'
    if (!isEdit && !password) nextErrors.password = 'Kata sandi wajib diisi.'
    if ((!isEdit || password !== '') && password !== passwordConfirmation) {
      nextErrors.password_confirmation = 'Konfirmasi kata sandi tidak cocok.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const division = divisions.find((item) => String(item.id) === divisionId)

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone,
      role,
      division_id: divisionId === 'none' ? '' : divisionId,
      division_name: division?.name ?? null,
      division_slug: division?.slug ?? null,
      province_id: provinceId,
      city_id: cityId,
      district_id: districtId,
      village_id: villageId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="name">Nama lengkap</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(normalizeName(event.target.value))}
            placeholder="NAMA LENGKAP"
            required
          />
          <InputError message={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Alamat email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            required
          />
          <InputError message={errors.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Nomor handphone</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            minLength={10}
            maxLength={13}
            pattern="08[0-9]{8,11}"
            value={phone}
            onChange={(event) => setPhone(normalizePhone(event.target.value))}
            placeholder="08XXXXXXXXXX"
            required
          />
          <InputError message={errors.phone} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={role}
            onValueChange={setRole}
            placeholder="Pilih role"
            options={roles.map((item) => ({ value: item, label: item }))}
          />
          <InputError message={errors.role} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="division_id">Divisi</Label>
          <Select
            value={divisionId}
            onValueChange={setDivisionId}
            options={[
              { value: 'none', label: 'Tanpa divisi' },
              ...divisions.map((division) => ({ value: String(division.id), label: division.name })),
            ]}
          />
          <InputError message={errors.division_id} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">{isEdit ? 'Kata sandi baru' : 'Kata sandi'}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isEdit ? 'Kosongkan jika tidak diubah' : 'Masukkan kata sandi'}
            required={!isEdit}
          />
          <InputError message={errors.password} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Konfirmasi kata sandi</Label>
          <Input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            placeholder="Ulangi kata sandi"
            required={!isEdit || password !== ''}
          />
          <InputError message={errors.password_confirmation} />
        </div>

        <div className="md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="province_id">Provinsi</Label>
              <Select
                value={provinceId}
                onValueChange={handleProvinceChange}
                placeholder="Pilih provinsi"
                options={provinces.map((item) => ({ value: item.id, label: item.name }))}
              />
              <InputError message={errors.province_id} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city_id">Kota / Kabupaten</Label>
              <Select
                value={cityId}
                onValueChange={handleCityChange}
                placeholder="Pilih kota / kabupaten"
                disabled={provinceId === ''}
                options={cityOptions.map((item) => ({ value: item.id, label: item.name }))}
              />
              <InputError message={errors.city_id} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="district_id">Kecamatan</Label>
              <Select
                value={districtId}
                onValueChange={handleDistrictChange}
                placeholder="Pilih kecamatan"
                disabled={cityId === ''}
                options={districtOptions.map((item) => ({ value: item.id, label: item.name }))}
              />
              <InputError message={errors.district_id} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="village_id">Kelurahan / Desa</Label>
              <Select
                value={villageId}
                onValueChange={setVillageId}
                placeholder="Pilih kelurahan / desa"
                disabled={districtId === ''}
                options={villageOptions.map((item) => ({ value: item.id, label: item.name }))}
              />
              <InputError message={errors.village_id} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">{submitLabel ?? (isEdit ? 'Simpan perubahan' : 'Buat pengguna')}</Button>
      </div>
    </form>
  )
}
