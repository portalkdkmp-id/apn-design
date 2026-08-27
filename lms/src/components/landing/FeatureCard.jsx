import { FeatureIcon } from '../ui/Icon'

const tones = {
  red: 'bg-red-50 text-[#d92b2b] border-red-200 dark:bg-red-950/30 dark:border-red-900/50',
  blue: 'bg-blue-50 text-[#3d7ce0] border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50',
  yellow: 'bg-yellow-50 text-[#d99a12] border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900/50',
}

export function FeatureCard({ feature }) {
  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-black/[0.06] bg-gray-50/70 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-gray-100/80 hover:shadow-xl dark:border-white/10 dark:bg-[#181113]/80 dark:hover:bg-[#21181a]/90">
      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#c81e2a] to-transparent transition duration-300 group-hover:scale-x-100" />
      <div className={`mb-5 grid size-[46px] place-items-center rounded-xl border ${tones[feature.tone]}`}>
        <FeatureIcon name={feature.icon} />
      </div>
      <h3 className="font-display mb-2 text-[17px] font-bold text-[#201415] dark:text-[#f7f2ee]">
        {feature.title}
      </h3>
      <p className="text-[13.8px] leading-relaxed text-[#746563] dark:text-[#b8abaa]">
        {feature.description}
      </p>
    </article>
  )
}
