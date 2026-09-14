import { Link } from 'react-router-dom'
import {
  Route,
  UserRound,
  Database,
  Gauge,
  ClipboardCheck,
  ChartNoAxesCombined,
} from 'lucide-react'

import { AdminLayout } from '../../layouts/AdminLayout'

const overviewGroups = [
  [
    { title: 'Learning Path', description: 'Kelola jalur pembelajaran', icon: Route, href: '/admin/learning-paths' },
    { title: 'User', description: 'Kelola akun pengguna', icon: UserRound, href: '/admin/users' },
  ],
  [
    { title: 'Bank Soal', description: 'Repository soal reusable', icon: Database, href: '/admin/bank-soal' },
    { title: 'Tingkat Kesulitan', description: 'Master poin soal', icon: Gauge, href: '/admin/tingkat-kesulitan' },
  ],
  [
    { title: 'Ujian', description: 'Manajemen ujian dan soal', icon: ClipboardCheck, href: '/admin/manajemen-ujian' },
    { title: 'Hasil Ujian', description: 'Analitik hasil peserta', icon: ChartNoAxesCombined, href: '/admin/analitik-tes' },
  ],
]

const statistics = [
  ['Total User', '6', 'Akun aktif yang terdaftar', 'from-[#B30000] to-[#e90000]'],
  ['Learning Path', '11', 'Seluruh learning path aktif dan draft.', 'from-[#FF0000] to-[#ff3838]'],
  ['Total Modul', '24', 'Total modul pembelajaran yang tersedia.', 'from-[#efaaaa] to-[#f0a6a6]'],
  ['Bank Soal', '1000', 'Soal reusable di seluruh ujian.', 'from-[#9A0000] to-[#c80000]'],
  ['Total Ujian', '10', 'Ujian draft dan published.', 'from-[#E70000] to-[#af2929]'],
  ['Hasil Ujian', '7', 'Attempt yang sudah dikumpulkan.', 'from-[#bd7373] to-[#b86e6e]'],
  ['Role', '5', 'Role akses aplikasi.', 'from-[#820000] to-[#850b06]'],
  ['Permission', '8', 'Permission yang tersedia.', 'from-[#CD0000] to-[#79211e]'],
  ['Difficulty', '3', 'Master bobot kesulitan soal.', 'from-[#96514e] to-[#8d4946]'],
]

export function DashboardPage() {
  return (
    <AdminLayout title="Dashboard LMS" subtitle="Pantau kondisi sistem dan akses cepat ke modul pengelolaan utama.">
      <section className="mb-14">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {overviewGroups.map((group, index) => (
            <div key={index} >
              <div className="grid gap-5">
                {group.map(({ title, description, icon: Icon, href }) => (
                  <Link
                    key={title}
                    to={href}
                    className="
                      group min-h-[180px] rounded-xl bg-white p-6 text-left text-[#26282d]  shadow-sm
                      transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg
                      dark:bg-[#242424] dark:text-white dark:hover:bg-[#2d2d2d]
                    "
                  >
                    <div className="flex h-full flex-col">
                      <h2 className="text-[20px] font-medium leading-tight tracking-wide">{title}</h2>
                      <p className="mt-3 max-w-[260px] text-[16px] leading-[1.35] text-black/55 dark:text-white/60">
                        {description}
                      </p>
                      <div className="mt-auto flex items-center pt-6">
                        <div
                          className="
                            flex size-10 items-center justify-center rounded-xl bg-red-50 text-[#c81e2a]
                            transition-all duration-200 group-hover:scale-110 group-hover:bg-[#c81e2a] group-hover:text-white
                            dark:bg-white/10 dark:text-white
                          "
                        >
                          <Icon size={20} strokeWidth={1.8} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-7">
          <h2 className="text-[22px] font-medium tracking-wide">Statistik Sistem</h2>
          <p className="mt-1 text-[13px] text-black/45 dark:text-white/50">Ringkasan data utama sistem LMS</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {statistics.map(([title, value, description, gradient]) => (
            <article
              key={title}
              className={`
                group relative min-h-[200px] overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}
                p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
              `}
            >
              <div className="absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />
              <div className="relative z-10">
                <h3 className="text-[18px] font-medium tracking-wide">{title}</h3>
                <div className="mt-7 text-[42px] font-medium leading-none">{value}</div>
                <p className="mt-7 max-w-[330px] text-[14px] leading-[1.45] text-white/85">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  )
}
