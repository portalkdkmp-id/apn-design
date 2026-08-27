import { ThemeToggle } from '../components/common/ThemeToggle'

export function AuthLayout({ children, dark, onToggleTheme, wide = false }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#ffb3b5] text-[#171111] transition-colors duration-500 dark:bg-[#72070a] dark:text-[#f7f2ee]">
      <div className="auth-bg" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.38),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_18%,rgba(255,40,40,0.12),transparent_40%)]" />
      <div className="absolute right-5 top-5 z-20 md:right-8 md:top-8"><ThemeToggle dark={dark} onToggle={onToggleTheme} floating /></div>
      <div className={`relative z-10 mx-auto flex min-h-screen w-full items-center justify-center px-4 py-10 sm:px-6 md:py-16 ${wide ? 'max-w-[1040px]' : 'max-w-[680px]'}`}>
        {children}
      </div>
    </main>
  )
}
