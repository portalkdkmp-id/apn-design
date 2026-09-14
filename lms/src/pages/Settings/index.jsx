import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { KeyRound, Palette, UserRound } from 'lucide-react'

import { MainLayout } from '../../layouts/MainLayout'
import { SECURITY_DEFAULTS } from '../../data/settings'
import ProfileSection from '../Admin/settings/profile-section'
import SecuritySection from '../Admin/settings/security-section'
import AppearanceSection from '../Admin/settings/appearance-section'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { value: 'profile', label: 'Profile', icon: UserRound },
  { value: 'security', label: 'Security', icon: KeyRound },
  { value: 'appearance', label: 'Appearance', icon: Palette },
]

export function SettingsIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = NAV_ITEMS.some((item) => item.value === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'profile'

  const { user: authUser, updateUser } = useAuth()
  const [user, setUser] = useState(authUser)
  const [security, setSecurity] = useState(SECURITY_DEFAULTS)

  const setActiveTab = (value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('tab', value)
      return next
    })
  }

  const handleProfileUpdate = (values) => {
    setUser((current) => ({ ...current, ...values }))
    updateUser(values)
  }

  return (
    <MainLayout title="Settings">
      <section className="mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1f2937] dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Kelola profil, keamanan, dan tampilan akun kamu.
          </p>
        </div>

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
              <ProfileSection user={user} onUpdate={handleProfileUpdate} />
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
      </section>
    </MainLayout>
  )
}

export default SettingsIndex
