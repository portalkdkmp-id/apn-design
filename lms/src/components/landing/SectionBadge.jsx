export function SectionBadge({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/[0.08] px-4 py-1.5 font-mono text-[11.5px] tracking-wider text-[#d99a12]">
      <span className="size-1.5 rounded-full bg-[#d99a12]" />{children}
    </div>
  )
}
