import { stats } from '../../data/content'

export function Stats() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-7 rounded-[28px] border border-black/[0.09] bg-white/80 px-6 py-8 shadow-sm backdrop-blur-sm md:px-14 dark:border-white/10 dark:bg-[#181113]/80">
      {stats.map(([num, label, tone], i) => (
        <div key={label} className="flex min-w-[120px] flex-1 items-center justify-center">
          <div className="text-center">
            <div className={`font-display text-4xl font-extrabold leading-none tracking-tight ${tone === 'red' ? 'text-[#c81e2a]' : tone === 'yellow' ? 'text-[#d99a12]' : tone === 'blue' ? 'text-[#1d6fd1]' : 'text-[#201415] dark:text-[#f7f2ee]'}`}>
              {num}
            </div>
            <div className="mt-2.5 text-[13px] text-[#746563] dark:text-[#b8abaa]">{label}</div>
          </div>
          {i < stats.length - 1 && <div className="ml-auto hidden h-[52px] w-px bg-black/10 md:block dark:bg-white/10" />}
        </div>
      ))}
    </div>
  )
}
