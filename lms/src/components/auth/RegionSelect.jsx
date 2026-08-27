import { ChevronDown } from 'lucide-react'

export function RegionSelect({ label, name, value, onChange, options, disabled = false, error }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[14px] font-medium text-[#24191a] dark:text-[#f2dddd]">{label}</label>
      <div className="relative">
        <select id={name} name={name} value={value} onChange={onChange} disabled={disabled} required
          className={[
            'h-12 w-full appearance-none rounded-[7px] border border-transparent bg-white px-4 pr-10 text-[14px] text-[#201415] outline-none transition focus:border-[#c80008] focus:ring-2 focus:ring-[#c80008]/10 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-[#a59a9a]',
            error ? 'border-red-500' : '',
          ].join(' ')}>
          <option value="">Pilih {label.toLowerCase()}</option>
          {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#746565]" size={18} />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{error}</p>}
    </div>
  )
}
