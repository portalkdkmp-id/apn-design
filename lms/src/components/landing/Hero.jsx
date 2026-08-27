import { Check } from 'lucide-react'

export function Hero() {
  return (
    <section id="beranda" className="relative z-10 mx-auto max-w-[1180px] px-5 pb-16 pt-24 text-center md:px-8">
      <div className="relative">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/[0.08] px-4 py-1.5 font-mono text-[11.5px] tracking-wider text-[#d99a12]">
          <span className="size-1.5 rounded-full bg-[#d99a12] shadow-[0_0_8px_#d99a12]" /> Program Pemerintah Desa
        </div>
        <h1 className="font-display mx-auto mb-5 max-w-[840px] text-[clamp(38px,5.6vw,64px)] font-extrabold leading-[1.05] tracking-tight">
          Belajar Kapan Saja, <br /><span className="text-[#c81e2a]">Di Mana Saja</span>
        </h1>
        <p className="mx-auto mb-9 max-w-[560px] text-[17px] leading-relaxed text-[#746563] dark:text-[#b8abaa]">
          Nikmati kemudahan belajar kapan saja dan di mana saja, dengan dukungan video pembelajaran dan fitur interaktif untuk anggota Koperasi Desa Kelurahan Merah Putih.
        </p>
        <div className="mb-11 flex flex-wrap justify-center gap-3.5">
          <a href="/register" className="rounded-full bg-[#c81e2a] px-[22px] py-3 font-semibold text-white shadow-lg shadow-red-700/20 transition hover:-translate-y-px hover:bg-[#a91923]">Daftar Sekarang</a>
          <a href="#fitur" className="rounded-full border border-black/10 px-[22px] py-3 font-semibold text-[#201415] transition hover:border-red-500/30 dark:border-white/10 dark:text-[#f7f2ee] dark:hover:border-red-400/40">Lihat Fitur Utama</a>
        </div>
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-3.5 text-[13.5px] text-[#746563] dark:text-[#b8abaa]">
          {['Modul Terstruktur', 'Kuis Interaktif', 'E-Library Lengkap', 'Akses 24 Jam'].map((item) => (
            <span key={item} className="flex items-center gap-1.5"><Check size={15} className="text-[#d92b2b]" />{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
