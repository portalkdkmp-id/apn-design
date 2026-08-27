import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ dark, onToggle, floating = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Gunakan mode terang' : 'Gunakan mode gelap'}
      title={dark ? 'Mode terang' : 'Mode gelap'}
      className={[
        'grid size-10 place-items-center rounded-full transition',
        floating
          ? 'border border-black/10 bg-white/75 text-[#8f1414] shadow-lg backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-black/40 dark:text-red-300 dark:hover:bg-black/60'
          : 'border border-white/30 text-white hover:border-white hover:bg-white/10',
      ].join(' ')}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
