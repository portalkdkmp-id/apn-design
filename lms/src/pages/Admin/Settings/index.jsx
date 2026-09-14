import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { KeyRound, Palette, UserRound } from 'lucide-react'

import { AdminLayout } from '../../../layouts/AdminLayout'
import { CURRENT_USER, SECURITY_DEFAULTS } from '../../../data/settings'
import ProfileSection from './profile-section'
import SecuritySection from './security-section'
import AppearanceSection from './appearance-section'

const NAV_ITEMS = [
  { value: 'profile', label: 'Profile', icon: UserRound },
  { value: 'security', label: 'Security', icon: KeyRound },
  { value: 'appearance', label: 'Appearance', icon: Palette },
]

export default function AdminSettingsIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = NAV_ITEMS.some((item) => item.value === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'profile'

  const [user, setUser] = useState(CURRENT_USER)
  const [security, setSecurity] = useState(SECURITY_DEFAULTS)

  const setActiveTab = (value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('tab', value)
      return next
    })
  }

  return (
    <AdminLayout
      title="Settings"
      subtitle="Kelola profil, keamanan, dan tampilan akun kamu."
      breadcrumbs={[{ label: 'Superadmin', href: '/dashboard' }, { label: 'Settings' }]}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="w-full lg:w-52">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Settings">
            {NAV_ITEMS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`
                  flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
                  ${
                    activeTab === value
                      ? 'bg-black/5 text-[#c81e2a] dark:bg-white/10 dark:text-white'
                      : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10'
                  }
                `}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {activeTab === 'profile' && (
            <ProfileSection user={user} onUpdate={(values) => setUser((current) => ({ ...current, ...values }))} />
          )}
          {activeTab === 'security' && (
            <SecuritySection
              security={security}
              onUpdateSecurity={(values) => setSecurity((current) => ({ ...current, ...values }))}
            />
          )}
          {activeTab === 'appearance' && <AppearanceSection />}
        </div>
      </div>
    </AdminLayout>
  )
}
