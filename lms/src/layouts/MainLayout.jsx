import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  LayoutGrid,
  Building2,
  ShieldCheck,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react'

import logo from '../assets/logokdkmp.png'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

// Menu utama untuk user non-superadmin (manager & staff), meniru
// `mainNavItems` pada `resources/js/components/app-sidebar.tsx` di lms_apn.
const MENU = [
  { label: 'DASHBOARD', icon: LayoutGrid, href: '/dashboard' },
  { label: 'TES SAYA', icon: ClipboardCheck, href: '/tests' },
  { label: 'MATERI', icon: BookOpen, href: '/learning-paths' },
]

const ROLE_LABELS = {
  manager: 'Manager',
  staff: 'Staff',
}

function isPathActive(pathname, href) {
  if (!href) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function initialsOf(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Sidebar({ open, onClose }) {
  const location = useLocation()
  const { user, hasRole } = useAuth()
  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role ?? ''

  return (
    <>
      {open && (
        <button
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex h-screen w-[280px] flex-col overflow-hidden
          bg-gradient-to-b from-[#c81e2a] via-[#9c0e14] to-[#6d0000]
          px-5 py-6 text-white shadow-xl transition-transform duration-300
          lg:w-[260px] lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="mb-8 flex shrink-0 items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-white/90 shadow-sm">
            <img src={logo} alt="APN LMS" className="h-6 w-auto object-contain" />
          </div>
          <span className="text-[15px] font-medium tracking-wide">APN LMS</span>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto px-1 scrollbar-none">
          {MENU.map(({ label, icon: Icon, href }) => {
            const active = isPathActive(location.pathname, href)
            return (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                className={`
                  flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left
                  text-[10px] font-medium tracking-[0.04em] transition-all
                  ${active ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}
                `}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            )
          })}

          {user?.division && (
            <Link
              to="/division/dashboard"
              onClick={onClose}
              className={`
                flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left
                text-[10px] font-medium tracking-[0.04em] transition-all
                ${isPathActive(location.pathname, '/division/dashboard') ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}
              `}
            >
              <Building2 size={18} strokeWidth={2} />
              <span>AREA {user.division.name.toUpperCase()}</span>
            </Link>
          )}

          {hasRole('superadmin') && (
            <Link
              to="/admin/dashboard"
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] font-medium tracking-[0.04em] transition-all hover:bg-white/10"
            >
              <ShieldCheck size={18} strokeWidth={2} />
              <span>SUPERADMIN</span>
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        <div className="shrink-0">
          <div className="flex items-center gap-3 px-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-xs font-semibold text-[#e40000]">
              {initialsOf(user?.name) || '—'}
            </div>
            <div>
              <p className="text-[13px] font-medium">{user?.name}</p>
              <p className="text-[10px] text-white/70">{roleLabel}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export function MainLayout({ title, subtitle, breadcrumbs = [], actions, children }) {
  const { dark, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.replace('/')
  }

  return (
    <div
      className={`
        min-h-screen transition-colors duration-300
        ${dark ? 'bg-[#151515] text-[#f5f5f5]' : 'bg-[#f2f2f2] text-[#26282d]'}
      `}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen lg:ml-[260px]">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`
                rounded-xl p-2 transition lg:hidden
                ${dark ? 'hover:bg-white/10' : 'hover:bg-black/5'}
              `}
              aria-label="Buka menu"
            >
              <Menu size={22} />
            </button>

            <div>
              {breadcrumbs.length > 0 && (
                <div className="hidden items-center gap-1.5 text-[11px] text-black/40 dark:text-white/40 sm:flex">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.label} className="flex items-center gap-1.5">
                      {index > 0 && <ChevronRight size={12} />}
                      {crumb.href ? (
                        <Link to={crumb.href} className="hover:text-[#c81e2a]">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              <p className="hidden text-[15px] font-medium tracking-wide text-[#e20b0b] sm:block">
                {title ?? 'Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? 'Gunakan mode terang' : 'Gunakan mode gelap'}
              title={dark ? 'Mode terang' : 'Mode gelap'}
              className={`
                grid size-10 place-items-center rounded-full border transition-all duration-300
                ${
                  dark
                    ? 'border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/15'
                    : 'border-[#f0b5b5] bg-white text-[#c81e2a] shadow-sm hover:bg-[#fff5f5]'
                }
              `}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex items-center gap-2 rounded-full bg-[#c81e2a] px-[22px] py-3
                text-[12px] font-semibold text-white shadow-lg shadow-red-700/20
                transition hover:-translate-y-px hover:bg-[#a91923]
              "
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>

        <div className="px-5 pb-14 sm:px-8 lg:px-8">
          {(title || subtitle || actions) && (
            <section className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                {title && (
                  <h1 className="mb-0.5 text-[clamp(20px,3vw,26px)] font-bold tracking-wide">{title}</h1>
                )}
                {subtitle && (
                  <p
                    className={`
                      max-w-2xl text-[clamp(13px,2vw,15px)] tracking-wide
                      ${dark ? 'text-white/60' : 'text-[#5f6166]'}
                    `}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </section>
          )}

          {children}
        </div>
      </main>
    </div>
  )
}

export default MainLayout
