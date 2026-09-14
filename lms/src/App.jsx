import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/Home/HomePage'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { DivisionDashboardPage } from './pages/Division/DashboardPage'
import { LearningPathsIndex } from './pages/LearningPaths/index'
import { LearningPathShow } from './pages/LearningPaths/show'
import { LearningPathModuleShow } from './pages/LearningPaths/modules/show'
import { TestModulesIndex } from './pages/Tests/modules/index'
import { TestModuleShow } from './pages/Tests/modules/show'
import { TestAttemptShow } from './pages/Tests/attempts/show'
import { TestAttemptResult } from './pages/Tests/attempts/result'
import { SettingsIndex } from './pages/Settings/index'
import { ToastProvider } from './components/ui/Toast'
import { useTheme } from './hooks/useTheme'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, GuestRoute } from '../routes/ProtectedRoute'
import { DashboardEntry } from '../routes/DashboardEntry'

import AdminLearningPathsIndex from './pages/Admin/Learning-paths/index'
import AdminLearningPathsCreate from './pages/Admin/Learning-paths/create'
import AdminLearningPathsEdit from './pages/Admin/Learning-paths/edit'
import AdminLearningPathModulesIndex from './pages/Admin/Learning-paths/modules/index'
import AdminLearningPathModulesCreate from './pages/Admin/Learning-paths/modules/create'
import AdminLearningPathModulesEdit from './pages/Admin/Learning-paths/modules/edit'
import AdminQuestionsIndex from './pages/Admin/Questions/index'
import AdminQuestionDifficultiesIndex from './pages/Admin/Question-difficulties/index'

/*permissions*/
import AdminPermissionsIndex from './pages/Admin/Permissions/index'
import AdminPermissionsCreate from './pages/Admin/Permissions/create'
import AdminPermissionsEdit from './pages/Admin/Permissions/edit'
/*divisions*/
import AdminDivisionsIndex from './pages/Admin/Divisions/index'
/*roles*/
import AdminRolesIndex from './pages/Admin/Roles/index'
/* users */
import AdminUsersIndex from './pages/Admin/Users/index'

/* quiz-modules atau manajemen ujian */
import AdminQuizModulesIndex from './pages/Admin/Quiz-modules/index'
/* quiz-analytics atau analitik tes */
import AdminQuizAnalyticsIndex from './pages/Admin/Quiz-analytics/index'
/* settings */
import AdminSettingsIndex from './pages/Admin/settings/index'

function App() {
  const { dark, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<HomePage dark={dark} onToggleTheme={toggleTheme} />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage dark={dark} onToggleTheme={toggleTheme} />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage dark={dark} onToggleTheme={toggleTheme} />
                </GuestRoute>
              }
            />

            {/* Dashboard umum: superadmin diarahkan ke /admin/dashboard,
                manager & staff melihat dashboard mereka sendiri. */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardEntry />
                </ProtectedRoute>
              }
            />

            {/* Area divisi: untuk manager/staff yang punya divisi */}
            <Route
              path="/division/dashboard"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <DivisionDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Materi (Learning Path) */}
            <Route
              path="/learning-paths"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <LearningPathsIndex />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-paths/:id"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <LearningPathShow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-paths/:id/modules/:moduleId"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <LearningPathModuleShow />
                </ProtectedRoute>
              }
            />

            {/* Tes Saya (Ujian) */}
            <Route
              path="/tests"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <TestModulesIndex />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests/:id"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <TestModuleShow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests/attempts/:attemptId"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <TestAttemptShow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests/attempts/:attemptId/result"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <TestAttemptResult />
                </ProtectedRoute>
              }
            />

            {/* Settings (profil, keamanan, tampilan) */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={['manager', 'staff']}>
                  <SettingsIndex />
                </ProtectedRoute>
              }
            />

            {/* Superadmin only */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['superadmin']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Learning Path (Master Data) */}
            <Route path="/admin/learning-paths" element={<ProtectedRoute roles={['superadmin']}><AdminLearningPathsIndex /></ProtectedRoute>} />
            <Route path="/admin/learning-paths/create" element={<ProtectedRoute roles={['superadmin']}><AdminLearningPathsCreate /></ProtectedRoute>} />
            <Route path="/admin/learning-paths/:id/edit" element={<ProtectedRoute roles={['superadmin']}><AdminLearningPathsEdit /></ProtectedRoute>} />
            <Route path="/admin/learning-paths/:id/modules" element={<ProtectedRoute roles={['superadmin']}><AdminLearningPathModulesIndex /></ProtectedRoute>} />
            <Route path="/admin/learning-paths/:id/modules/create" element={<ProtectedRoute roles={['superadmin']}><AdminLearningPathModulesCreate /></ProtectedRoute>} />
            <Route path="/admin/learning-paths/:id/modules/:moduleId/edit" element={<ProtectedRoute roles={['superadmin']}><AdminLearningPathModulesEdit /></ProtectedRoute>} />
            {/* Questions (Master Data)*/}
            <Route path="/admin/bank-soal" element={<ProtectedRoute roles={['superadmin']}><AdminQuestionsIndex /></ProtectedRoute>} />
            <Route path="/admin/tingkat-kesulitan" element={<ProtectedRoute roles={['superadmin']}><AdminQuestionDifficultiesIndex /></ProtectedRoute>} />

             {/* Permission (halaman terpisah) */}
            <Route path="/admin/permissions" element={<ProtectedRoute roles={['superadmin']}><AdminPermissionsIndex /></ProtectedRoute>} />
            <Route path="/admin/permissions/create" element={<ProtectedRoute roles={['superadmin']}><AdminPermissionsCreate /></ProtectedRoute>} />
            <Route path="/admin/permissions/:id/edit" element={<ProtectedRoute roles={['superadmin']}><AdminPermissionsEdit /></ProtectedRoute>} />
            {/* Divisi (modal create/edit) */}
            <Route path="/admin/divisions" element={<ProtectedRoute roles={['superadmin']}><AdminDivisionsIndex /></ProtectedRoute>} />
            {/*Roles  (modal create/edit) */}
            <Route path="/admin/roles" element={<ProtectedRoute roles={['superadmin']}><AdminRolesIndex /></ProtectedRoute>} />
            {/* Users */}
            <Route path="/admin/users" element={<ProtectedRoute roles={['superadmin']}><AdminUsersIndex /></ProtectedRoute>} />
            {/*Quiz-modules*/}
            <Route path="/admin/manajemen-ujian" element={<ProtectedRoute roles={['superadmin']}><AdminQuizModulesIndex /></ProtectedRoute>} />
            {/*Quiz-analytics*/}
             <Route path="/admin/analitik-tes" element={<ProtectedRoute roles={['superadmin']}><AdminQuizAnalyticsIndex /></ProtectedRoute>} />
             {/* Settings*/}
             <Route path="/admin/settings" element={<ProtectedRoute roles={['superadmin']}><AdminSettingsIndex /></ProtectedRoute>} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export { App }
