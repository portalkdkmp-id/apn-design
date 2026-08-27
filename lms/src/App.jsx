import { HomePage } from './pages/Home/HomePage'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { useTheme } from './hooks/useTheme'

function App() {
  const { dark, toggleTheme } = useTheme()
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login') return <LoginPage dark={dark} onToggleTheme={toggleTheme} />
  if (path === '/register') return <RegisterPage dark={dark} onToggleTheme={toggleTheme} />
  return <HomePage dark={dark} onToggleTheme={toggleTheme} />
}

export { App }
