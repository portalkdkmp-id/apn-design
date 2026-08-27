import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { AuthCard } from '../../components/auth/AuthCard'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthInput } from '../../components/auth/AuthInput'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { AuthFooterLink } from '../../components/auth/AuthFooterLink'
import { AuthLayout } from '../../layouts/AuthLayout'

export function LoginPage({ dark, onToggleTheme }) {
  const [form, setForm] = useState({ login: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitted(false)
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.login.trim()) next.login = 'Email atau nomor handphone wajib diisi.'
    if (!form.password) next.password = 'Kata sandi wajib diisi.'
    setErrors(next)
    setSubmitted(Object.keys(next).length === 0)
  }

  return (
    <AuthLayout dark={dark} onToggleTheme={onToggleTheme}>
      <AuthCard>
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-xs text-[#746565] transition hover:text-[#c80008] dark:text-[#cfa0a0] dark:hover:text-red-300">
            <ArrowLeft size={15} /> Kembali ke beranda
          </a>
        </div>

        <AuthHeader
          title="Masuk ke akun"
          description={<>Gunakan email atau nomor handphone dan kata sandi<br className="hidden sm:block" /> untuk masuk</>}
        />

        {submitted && <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Form siap diintegrasikan ke endpoint <strong>POST /login</strong>.</div>}

        <form onSubmit={submit} noValidate className="space-y-5">
          <AuthInput label="Email atau nomor handphone" name="login" value={form.login} onChange={update} autoComplete="username" error={errors.login} />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-[14px] font-medium text-[#24191a] dark:text-[#f2dddd]">Kata sandi</label>
              <a href="/forgot-password" className="text-[14px] text-[#24191a] transition hover:text-[#c80008] dark:text-[#f2dddd] dark:hover:text-red-300">Lupa kata sandi?</a>
            </div>
            <PasswordInput label="" name="password" value={form.password} onChange={update} autoComplete="current-password" error={errors.password} />
          </div>

          <label className="flex cursor-pointer items-center gap-3 pt-0.5 text-[14px] text-[#24191a] dark:text-[#f2dddd]">
            <input type="checkbox" name="remember" checked={form.remember} onChange={update} className="size-5 rounded border-[#d7cece] accent-[#c80008]" />
            Ingat Saya
          </label>

          <button type="submit" className="mt-2 h-14 w-full rounded-[6px] bg-[#d40008] text-[16px] font-medium text-white shadow-lg shadow-red-900/10 transition hover:bg-[#b80007] focus:outline-none focus:ring-4 focus:ring-red-500/20">
            Masuk
          </button>
        </form>

        <AuthFooterLink prompt="Belum punya akun?" href="/register">Daftar</AuthFooterLink>
      </AuthCard>
    </AuthLayout>
  )
}
