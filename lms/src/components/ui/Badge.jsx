const VARIANT_CLASSES = {
  default: 'bg-[#c81e2a] text-white',
  secondary: 'bg-black/5 text-inherit dark:bg-white/10',
  outline: 'border border-black/10 bg-transparent text-inherit dark:border-white/15',
}

export function Badge({ variant = 'default', className = '', children, ...props }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2.5 py-1
        text-xs font-medium
        ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
