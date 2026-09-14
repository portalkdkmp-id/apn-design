import { Moon, Sun } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useTheme } from '../../../hooks/useTheme'

const OPTIONS = [
  { value: false, label: 'Light', icon: Sun },
  { value: true, label: 'Dark', icon: Moon },
]

export default function AppearanceSection() {
  const { dark, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan tampilan</CardTitle>
        <CardDescription>Sesuaikan tema tampilan akun kamu.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/10">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setTheme(value)}
              className={`
                flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm transition-colors
                ${
                  dark === value
                    ? 'bg-white text-[#26282d] shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                    : 'text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10'
                }
              `}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
