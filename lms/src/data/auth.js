// Sumber data auth untuk mock FE ini.
//
// PENTING (integrasi ke backend `lms_apn` nanti):
// Struktur `permissions` di bawah ini sengaja dibuat menyerupai payload
// `auth.user` + daftar permission yang akan dikirim backend (mis. lewat
// Inertia shared props `auth.permissions`). Halaman/komponen FE membaca
// role & permission dari sini (lewat AuthContext), BUKAN dari string role
// yang di-hardcode di banyak tempat. Jadi saat backend asli sudah siap,
// yang perlu diganti cukup fungsi `authenticate()` di bawah (dari cek ke
// array lokal menjadi call ke POST /login), bentuk datanya tetap sama.

// Role saat ini mengikuti `DatabaseSeeder` di project lms_apn:
// superadmin, manager, staff.
export const ROLE_PERMISSIONS = {
  superadmin: [
    'admin.dashboard.view',
    'admin.users.manage',
    'admin.roles.manage',
    'admin.permissions.manage',
    'admin.divisions.manage',
    'admin.learning-paths.manage',
    'admin.questions.manage',
    'admin.quiz-modules.manage',
    'admin.quiz-analytics.view',
    'dashboard.view',
    'learning-paths.view',
    'tests.view',
  ],
  manager: ['dashboard.view', 'learning-paths.view', 'tests.view', 'division.dashboard.view'],
  staff: ['dashboard.view', 'learning-paths.view', 'tests.view', 'division.dashboard.view'],
}

// Akun contoh mengikuti tabel di `DatabaseSeeder` project lms_apn:
// | Role       | Email                  | Password   |
// | superadmin | superadmin@mail.com    | password   |
// | manager    | manager@mail.com       | password   |
// | staff      | staff@mail.com         | password   |
export const AUTH_ACCOUNTS = [
  {
    id: 'seed-superadmin',
    name: 'SUPERADMIN',
    email: 'superadmin@mail.com',
    password: 'password',
    role: 'superadmin',
    division: null,
  },
  {
    id: 'seed-manager',
    name: 'MANAGER',
    email: 'manager@mail.com',
    password: 'password',
    role: 'manager',
    division: { id: 1, name: 'Divisi Simpan Pinjam', slug: 'simpan-pinjam' },
  },
  {
    id: 'seed-staff',
    name: 'STAFF',
    email: 'staff@mail.com',
    password: 'password',
    role: 'staff',
    division: { id: 2, name: 'Divisi Pemasaran', slug: 'pemasaran' },
  },
]

export function findAccountByLogin(login) {
  const value = String(login ?? '').trim().toLowerCase()
  return AUTH_ACCOUNTS.find((account) => account.email.toLowerCase() === value)
}

// Meniru `POST /login` di backend: cek kredensial, lalu kembalikan payload
// `user` beserta `permissions`-nya (tanpa password).
export function authenticate({ login, password }) {
  const account = findAccountByLogin(login)

  if (!account || account.password !== password) {
    return { user: null, error: 'Email/nomor handphone atau kata sandi salah.' }
  }

  const { password: _password, ...user } = account

  return {
    user: {
      ...user,
      permissions: ROLE_PERMISSIONS[user.role] ?? [],
    },
    error: null,
  }
}

// Halaman "home" default untuk masing-masing role setelah login,
// mengikuti logic `DashboardController` di lms_apn:
// superadmin -> redirect ke /admin/dashboard, role lain -> /dashboard.
export function homePathForRole(role) {
  return role === 'superadmin' ? '/admin/dashboard' : '/dashboard'
}
