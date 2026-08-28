import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '../common/Logo'
import { ThemeToggle } from '../common/ThemeToggle'

export function Header({ dark, onToggleTheme }) {
  const [open, setOpen] = useState(false)

  // Menu yang sedang aktif
  const [activeLink, setActiveLink] = useState('#beranda')

  const links = [
    ['Beranda', '#beranda'],
    ['Learning Path', '#learning-path'],
    ['Tentang', '#tentang'],
    ['Fitur Utama', '#fitur'],
    ['Bantuan', '#bantuan'],
  ]

  const scrollTo = (href) => {
    // Set underline ke menu yang diklik
    setActiveLink(href)

    setOpen(false)

    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#ef3b34] to-[#d92b2b] shadow-lg shadow-red-900/20">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8">
        <nav className="flex items-center justify-between py-4">

          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo('#beranda')}
            className="text-left"
          >
            <Logo light />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-9 text-sm lg:flex">
            {links.map(([label, href]) => {
              const isActive = activeLink === href

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollTo(href)}
                  className={`
                    relative py-1.5
                    transition-colors duration-200
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-white/85 hover:text-white'
                    }
                  `}
                >
                  {label}

                  {/* Underline aktif */}
                  <span
                    className={`
                      absolute
                      bottom-[-2px]
                      left-0
                      right-0
                      h-0.5
                      rounded-full
                      bg-gradient-to-r from-white to-yellow-300
                      transition-all duration-300
                      ${
                        isActive
                          ? 'scale-x-100 opacity-100'
                          : 'scale-x-0 opacity-0'
                      }
                    `}
                  />
                </button>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <ThemeToggle
              dark={dark}
              onToggle={onToggleTheme}
            />

            {/* Login */}
            <a
              href="/login"
              className="hidden rounded-full bg-white px-[22px] py-2.5 text-[13.5px] font-semibold text-[#8f1414] shadow-md transition hover:-translate-y-px sm:inline-flex"
            >
              Masuk
            </a>

            {/* Register */}
            <a
              href="/register"
              className="hidden rounded-full border border-white/30 px-[22px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-white/10 md:inline-flex"
            >
              Daftar
            </a>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="grid size-10 place-items-center rounded-full border border-white/30 text-white lg:hidden"
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {open && (
          <div className="border-t border-white/15 py-3 lg:hidden">
            {links.map(([label, href]) => {
              const isActive = activeLink === href

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollTo(href)}
                  className={`
                    block w-full rounded-lg px-3 py-3 text-left text-sm
                    transition
                    ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/90 hover:bg-white/10'
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}

            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-[#8f1414]"
              >
                Masuk
              </a>

              <a
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/30 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Daftar
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

