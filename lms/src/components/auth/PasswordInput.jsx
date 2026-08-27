import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function PasswordInput({ label, name, value, onChange, error, autoComplete, disabled = false }) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      {label && <label htmlFor={name} className="mb-2 block text-[14px] font-medium text-[#24191a] dark:text-[#f2dddd]">{label}</label>}
      <div className="relative">
        <input id={name} name={name} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required disabled={disabled}
          className={[
            'h-12 w-full rounded-[7px] border bg-white px-4 pr-12 text-[14px] text-[#201415] outline-none transition focus:border-[#c80008] focus:ring-2 focus:ring-[#c80008]/10 dark:bg-white dark:text-[#201415]',
            error ? 'border-red-500' : 'border-transparent', disabled ? 'cursor-not-allowed opacity-60' : '',
          ].join(' ')}
        />
        <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#746565] transition hover:bg-black/5 hover:text-[#c80008]" aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{error}</p>}
    </div>
  )
}
