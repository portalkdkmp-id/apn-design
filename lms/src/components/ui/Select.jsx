import { ChevronDown } from 'lucide-react'

export function Select({ value, onValueChange, options, placeholder, className = '' }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        className={`
          h-10 w-full appearance-none rounded-lg border border-black/10 bg-white
          px-3 pr-9 text-sm outline-none transition-colors
          focus:border-[#c81e2a]
          dark:border-white/15 dark:bg-[#151515] dark:text-white
          ${className}
        `}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
      />
    </div>
  )
}
