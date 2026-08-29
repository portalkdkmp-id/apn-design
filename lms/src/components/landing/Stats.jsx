import { stats } from '../../data/content'

export function Stats() {
  return (
    <div className="rounded-[28px] border border-black/[0.09] bg-white/80 px-6 py-8 shadow-sm backdrop-blur-sm md:px-14 dark:border-white/10 dark:bg-[#181113]/80">
      
      <div className="grid grid-cols-1 divide-y divide-black/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 dark:divide-white/10">
        
        {stats.map(([num, label, tone]) => (
          <div
            key={label}
            className="flex min-h-[84px] flex-col items-center justify-center text-center"
          >
            <div
              className={`font-display text-4xl font-extrabold leading-none tracking-tight ${
                tone === 'red'
                  ? 'text-[#c81e2a]'
                  : tone === 'yellow'
                    ? 'text-[#d99a12]'
                    : tone === 'blue'
                      ? 'text-[#1d6fd1]'
                      : 'text-[#201415] dark:text-[#f7f2ee]'
              }`}
            >
              {num}
            </div>

            <div className="mt-2.5 text-[13px] text-[#746563] dark:text-[#b8abaa]">
              {label}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}