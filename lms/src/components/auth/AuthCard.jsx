export function AuthCard({ children, wide = false }) {
  return (
    <section className={[
      'w-full rounded-[28px] border border-white/70 bg-white/75 shadow-2xl shadow-red-950/10 backdrop-blur-[10px] transition-colors',
      'dark:border-black/30 dark:bg-[#100000]/90 dark:shadow-black/30',
      wide ? 'max-w-[920px] px-7 py-10 sm:px-12 md:px-20 md:py-14' : 'max-w-[584px] px-8 py-10 sm:px-12 md:px-16 md:py-14',
    ].join(' ')}>
      {children}
    </section>
  )
}
