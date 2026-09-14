export function Textarea({ className = '', rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`
        w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm
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
