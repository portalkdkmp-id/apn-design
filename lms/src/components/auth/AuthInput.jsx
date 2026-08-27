export function AuthInput({ label, name, type = 'text', value, onChange, placeholder = '', error, autoComplete, required = true, disabled = false }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[14px] font-medium text-[#24191a] dark:text-[#f2dddd]">{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} required={required} disabled={disabled}
        className={[
          'h-12 w-full rounded-[7px] border bg-white px-4 text-[14px] text-[#201415] outline-none transition placeholder:text-[#a59a9a] focus:border-[#c80008] focus:ring-2 focus:ring-[#c80008]/10 dark:border-white/10 dark:bg-white dark:text-[#201415]',
          error ? 'border-red-500' : 'border-transparent', disabled ? 'cursor-not-allowed opacity-60' : '',
        ].join(' ')}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{error}</p>}
    </div>
  )
}
