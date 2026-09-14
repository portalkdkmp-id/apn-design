export function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm
        outline-none transition-colors
        placeholder:text-black/40
        focus:border-[#c81e2a]
        dark:border-white/15 dark:bg-[#151515] dark:text-white dark:placeholder:text-white/40
        ${className}
      `}
      {...props}
    />
  )
}
