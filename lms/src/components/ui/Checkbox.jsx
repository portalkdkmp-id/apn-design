export function Checkbox({ className = '', ...props }) {
  return (
    <input
      type="checkbox"
      className={`
        size-4 rounded border border-black/20 accent-[#c81e2a]
        transition-colors
        focus:ring-2 focus:ring-[#c81e2a]/30
        dark:border-white/20 dark:bg-[#151515]
        ${className}
      `}
      {...props}
    />
  )
}
