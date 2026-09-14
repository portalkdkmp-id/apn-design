const VARIANT_CLASSES = {
  default:
    'bg-[#c81e2a] text-white shadow-sm hover:bg-[#a91923] focus-visible:outline-[#c81e2a]',
  outline:
    'border border-black/10 bg-transparent text-inherit hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10',
  ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
  destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600',
  secondary:
    'bg-black/5 text-inherit hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15',
}

const SIZE_CLASSES = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-11 px-6 text-sm',
  icon: 'size-9 p-0',
}

export function Button({
  as: Component = 'button',
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        font-medium transition-colors
        disabled:pointer-events-none disabled:opacity-50
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default}
        ${SIZE_CLASSES[size] ?? SIZE_CLASSES.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}
