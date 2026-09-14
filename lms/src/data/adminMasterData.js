// Data dummy mengikuti persis shape Props dari file .tsx asli di lms_apn,
// supaya nanti gampang tinggal diganti dengan props Inertia yang sebenarnya.

export const ADMIN_STATS = [
  { label: 'Total User', value: 6, description: 'Akun aktif yang terdaftar', tone: 'blue' },
  { label: 'Learning Path', value: 11, description: 'Seluruh learning path aktif dan draft.', tone: 'sky' },
  { label: 'Total Modul', value: 24, description: 'Total modul pembelajaran yang tersedia.', tone: 'emerald' },
  { label: 'Bank Soal', value: 1000, description: 'Soal reusable di seluruh ujian.', tone: 'orange' },
  { label: 'Total Ujian', value: 10, description: 'Ujian draft dan published.', tone: 'purple' },
  { label: 'Hasil Ujian', value: 7, description: 'Attempt yang sudah dikumpulkan.', tone: 'rose' },
  { label: 'Role', value: 5, description: 'Role akses aplikasi.', tone: 'indigo' },
  { label: 'Permission', value: 8, description: 'Permission yang tersedia.', tone: 'amber' },
  { label: 'Difficulty', value: 3, description: 'Master bobot kesulitan soal.', tone: 'slate' },
]

export const DIVISION_STATUSES = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
]

export const DIVISION_STATS = [
  { label: 'Total Divisi', value: 4, description: 'Seluruh divisi yang terdaftar.' },
  { label: 'Divisi Aktif', value: 3, description: 'Bisa dipakai untuk assignment baru.' },
  { label: 'Total User', value: 6, description: 'User yang tersebar di semua divisi.' },
  { label: 'Modul Tes Terbatas', value: 5, description: 'Modul tes dengan pembatasan divisi.' },
]

export const DIVISIONS = [
  {
    id: 1,
    name: 'Keuangan',
    slug: 'keuangan',
    description: 'Mengelola pencatatan dan pelaporan keuangan koperasi.',
    is_active: true,
    users_count: 3,
    quiz_modules_count: 2,
    created_at: '02 Agu 2026',
  },
  {
    id: 2,
    name: 'Operasional',
    slug: 'operasional',
    description: 'Menjalankan kegiatan operasional harian koperasi.',
    is_active: true,
    users_count: 2,
    quiz_modules_count: 1,
    created_at: '01 Agu 2026',
  },
  {
    id: 3,
    name: 'SDM',
    slug: 'sdm',
    description: 'Mengelola perekrutan dan pengembangan anggota.',
    is_active: true,
    users_count: 1,
    quiz_modules_count: 1,
    created_at: '28 Jul 2026',
  },
  {
    id: 4,
    name: 'Pemasaran',
    slug: 'pemasaran',
    description: 'Promosi dan pengembangan jaringan anggota baru.',
    is_active: false,
    users_count: 0,
    quiz_modules_count: 1,
    created_at: '20 Jul 2026',
  },
]

export const PERMISSIONS = [
  { id: 1, name: 'QUIZ.CREATE', roles_count: 2, created_at: '02 Agu 2026' },
  { id: 2, name: 'QUIZ.EDIT', roles_count: 2, created_at: '02 Agu 2026' },
  { id: 3, name: 'LEARNING_PATH.MANAGE', roles_count: 1, created_at: '01 Agu 2026' },
  { id: 4, name: 'USER.MANAGE', roles_count: 1, created_at: '30 Jul 2026' },
  { id: 5, name: 'DIVISION.MANAGE', roles_count: 1, created_at: '30 Jul 2026' },
  { id: 6, name: 'REPORT.VIEW', roles_count: 3, created_at: '28 Jul 2026' },
]

export function getPermissionById(id) {
  return PERMISSIONS.find((permission) => String(permission.id) === String(id)) ?? null
}

export const DIFFICULTY_SORT_OPTIONS = [
  { value: 'point', label: 'Point' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created' },
]

export const DIFFICULTY_DIRECTION_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
]

export const DIFFICULTIES = [
  { id: 1, name: 'Easy', point: 10, questions_count: 420, created_at: '02 Agu 2026' },
  { id: 2, name: 'Medium', point: 20, questions_count: 380, created_at: '02 Agu 2026' },
  { id: 3, name: 'Hard', point: 30, questions_count: 200, created_at: '02 Agu 2026' },
]

export const ROLES = [
  {
    id: 1,
    name: 'superadmin',
    permissions: [1, 2, 3, 4, 5, 6],
    permissions_count: 6,
    users_count: 1,
    permission_names: ['QUIZ.CREATE', 'QUIZ.EDIT', 'LEARNING_PATH.MANAGE', 'USER.MANAGE', 'DIVISION.MANAGE', 'REPORT.VIEW'],
    created_at: '02 Agu 2026',
  },
  {
    id: 2,
    name: 'manager',
    permissions: [3, 6],
    permissions_count: 2,
    users_count: 2,
    permission_names: ['LEARNING_PATH.MANAGE', 'REPORT.VIEW'],
    created_at: '01 Agu 2026',
  },
  {
    id: 3,
    name: 'staff',
    permissions: [1, 2, 6],
    permissions_count: 3,
    users_count: 3,
    permission_names: ['QUIZ.CREATE', 'QUIZ.EDIT', 'REPORT.VIEW'],
    created_at: '28 Jul 2026',
  },
  {
    id: 4,
    name: 'pelajar',
    permissions: [],
    permissions_count: 0,
    users_count: 0,
    permission_names: [],
    created_at: '20 Jul 2026',
  },
]

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function normalizePermissionName(value) {
  return value
    .replace(/[^a-zA-Z0-9._ -]/g, '')
    .replace(/\s{2,}/g, ' ')
    .toUpperCase()
}
