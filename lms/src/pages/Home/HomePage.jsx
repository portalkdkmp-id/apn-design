import { Header } from '../../components/landing/Header'
import { Hero } from '../../components/landing/Hero'
import { FeatureCard } from '../../components/landing/FeatureCard'
import { Stats } from '../../components/landing/Stats'
import { SectionBadge } from '../../components/landing/SectionBadge'
import { features } from '../../data/content'
import { AuroraBackground } from '../../components/landing/AuroraBackground'
import logo from '../../assets/logokdkmp.png'

export function HomePage({ dark, onToggleTheme }) {
  return (
    <div className={`min-h-screen transition-colors duration-500 ${dark ? 'bg-[#100b0c] text-[#f7f2ee]' : 'bg-white text-[#201415]'}`}>
      <AuroraBackground />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-40" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${dark ? 'rgba(247,242,238,0.045)' : 'rgba(32,20,21,0.05)'} 1px, transparent 1px)`, backgroundSize: '34px 34px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 75%)' }} />

      <Header dark={dark} onToggleTheme={onToggleTheme} />

      <main>
        <Hero />
        <Divider />
        <section id="fitur" className="relative z-10 mx-auto max-w-[1180px] px-5 pb-24 md:px-8">
          <div className="mx-auto mb-12 max-w-[600px] text-center">
            <SectionBadge>Fitur Utama</SectionBadge>
            <h2 className="font-display mb-3.5 text-[clamp(26px,3.4vw,38px)] font-bold tracking-tight">Semua yang Anda Butuhkan untuk Belajar</h2>
            <p className="text-[15.5px] leading-relaxed text-[#746563] dark:text-[#b8abaa]">Empat fitur inti yang dirancang untuk mendukung perjalanan belajar anggota koperasi, dari materi hingga evaluasi.</p>
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <FeatureCard key={feature.title} feature={feature} />)}</div>
        </section>

        <section id="tentang" className="relative z-10 mx-auto max-w-[1180px] px-5 pb-24 md:px-8">
          <div className="mx-auto mb-12 max-w-[600px] text-center">
            <SectionBadge>Data Statistik</SectionBadge>
            <h2 className="font-display text-[clamp(26px,3.4vw,38px)] font-bold tracking-tight">Perkembangan Belajar Bersama</h2>
          </div>
          <Stats />
        </section>

        <Divider small />
        <section id="daftar" className="relative z-10 mx-auto max-w-[1180px] px-5 pb-28 pt-20 md:px-8">
          <div className="mx-auto max-w-[720px] overflow-hidden rounded-[28px] border border-black/[0.09] bg-white/80 px-6 py-16 text-center shadow-xl shadow-black/5 backdrop-blur-sm dark:border-white/10 dark:bg-[#181113]/80 dark:shadow-black/30 md:px-10">
            <h2 className="font-display mb-3.5 text-[clamp(26px,3.6vw,36px)] font-extrabold">Mulai Belajar Hari Ini</h2>
            <p className="mx-auto mb-8 max-w-[440px] text-[15px] leading-relaxed text-[#746563] dark:text-[#b8abaa]">Bergabunglah dengan Koperasi Desa Kelurahan Merah Putih dan tingkatkan kapasitas Anda melalui pembelajaran digital.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/register" className="rounded-full bg-[#c81e2a] px-[22px] py-3 font-semibold text-white shadow-lg shadow-red-700/20 transition hover:-translate-y-px hover:bg-[#a91923]">Daftar</a>
              <a href="/login" className="rounded-full border border-black/10 px-[22px] py-3 font-semibold text-[#201415] transition hover:border-red-500/30 dark:border-white/10 dark:text-[#f7f2ee]">Masuk</a>
            </div>
          </div>
        </section>
        <section id="bantuan" className="sr-only" aria-label="Bantuan" />
      </main>

      <footer className="relative z-10 mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 border-t border-black/[0.09] px-5 py-7 text-[12.5px] text-[#746563] dark:border-white/10 dark:text-[#b8abaa] md:px-8">
        <div className="flex items-center gap-2.5 font-display text-[13px] font-bold"><img src={logo} alt="Logo Koperasi Desa Merah Putih" className="h-[32px] w-auto object-contain" /><span>LMS Koperasi Desa Kelurahan Desa Merah Putih</span></div>
        <div>© 2026 PT. Agrinas Pangan Nusantara. All Rights Reserved.</div>
      </footer>
    </div>
  )
}

function Divider({ small = false }) {
  return <div className="mx-auto max-w-[1180px] px-5 md:px-8"><div className={`${small ? 'my-1' : 'my-[72px]'} h-1.5 rounded-full opacity-85 bg-[linear-gradient(90deg,#c81e2a_0%,#c81e2a_32%,#d99a12_32%,#d99a12_36%,#8f1414_36%,#8f1414_68%,#d99a12_68%,#d99a12_70%,#1d6fd1_70%,#1d6fd1_100%)]`} /></div>
}