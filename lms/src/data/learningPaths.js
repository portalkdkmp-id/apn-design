export const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

export const PRIORITIES = [
  { value: 'mandatory', label: 'Mandatory' },
  { value: 'optional', label: 'Optional' },
]

export const AUDIENCE_TYPES = [
  { value: 'internal', label: 'Internal' },
  { value: 'public', label: 'Publik tanpa login' },
]

export const ROLE_OPTIONS = [
  { id: 1, name: 'Superadmin' },
  { id: 2, name: 'Admin Koperasi' },
  { id: 3, name: 'Anggota' },
  { id: 4, name: 'Pengurus' },
]

export const DIVISION_OPTIONS = [
  { id: 1, name: 'Keuangan' },
  { id: 2, name: 'Operasional' },
  { id: 3, name: 'SDM' },
  { id: 4, name: 'Pemasaran' },
]

export const LEARNING_PATH_STATS = [
  { label: 'Total Learning Path', value: 11, description: 'Seluruh learning path aktif dan draft.' },
  { label: 'Published', value: 7, description: 'Sudah bisa diakses peserta.' },
  { label: 'Draft', value: 4, description: 'Masih dalam penyusunan.' },
  { label: 'Total Modul', value: 24, description: 'Total modul di seluruh learning path.' },
]

export const LEARNING_PATHS = [
  {
    id: 1,
    title: 'Onboarding Keselamatan Kerja',
    slug: 'onboarding-keselamatan-kerja',
    excerpt: 'Materi wajib untuk seluruh anggota baru sebelum mulai bertugas.',
    content: '<p>Pengantar keselamatan kerja untuk anggota baru.</p>',
    status: 'published',
    priority: 'mandatory',
    audience_type: 'internal',
    role_ids: [3, 4],
    role_names: ['Anggota', 'Pengurus'],
    division_ids: [],
    division_names: [],
    modules_count: 5,
    published_at: '12 Agu 2026',
    created_at: '02 Agu 2026',
  },
  {
    id: 2,
    title: 'Dasar-Dasar Koperasi Merah Putih',
    slug: 'dasar-dasar-koperasi-merah-putih',
    excerpt: 'Pengenalan sejarah, nilai, dan prinsip koperasi.',
    content: '<p>Pengenalan koperasi merah putih.</p>',
    status: 'published',
    priority: 'mandatory',
    audience_type: 'public',
    role_ids: [],
    role_names: [],
    division_ids: [],
    division_names: [],
    modules_count: 8,
    published_at: '05 Agu 2026',
    created_at: '01 Agu 2026',
  },
  {
    id: 3,
    title: 'Pengelolaan Keuangan Divisi',
    slug: 'pengelolaan-keuangan-divisi',
    excerpt: 'Praktik pencatatan dan pelaporan keuangan harian.',
    content: '<p>Praktik pencatatan keuangan.</p>',
    status: 'draft',
    priority: 'optional',
    audience_type: 'internal',
    role_ids: [2],
    role_names: ['Admin Koperasi'],
    division_ids: [1],
    division_names: ['Keuangan'],
    modules_count: 3,
    published_at: null,
    created_at: '28 Jul 2026',
  },
  {
    id: 4,
    title: 'Layanan Pelanggan & Komunikasi',
    slug: 'layanan-pelanggan-komunikasi',
    excerpt: 'Teknik komunikasi dan penanganan keluhan anggota.',
    content: '<p>Teknik komunikasi.</p>',
    status: 'draft',
    priority: 'optional',
    audience_type: 'internal',
    role_ids: [],
    role_names: [],
    division_ids: [4],
    division_names: ['Pemasaran'],
    modules_count: 2,
    published_at: null,
    created_at: '20 Jul 2026',
  },
]

// key: learningPathId -> array modul
export const LEARNING_PATH_MODULES = {
  1: [
    {
      id: 101,
      learning_path_id: 1,
      parent_id: null,
      parent_title: null,
      title: 'Pengenalan APD',
      slug: 'pengenalan-apd',
      excerpt: 'Jenis dan fungsi alat pelindung diri.',
      content: '<p>Materi pengenalan APD.</p>',
      estimated_minutes: 15,
      position: 1,
      view_count: 120,
      children_count: 1,
      created_at: '02 Agu 2026',
      updated_at: '03 Agu 2026',
    },
    {
      id: 102,
      learning_path_id: 1,
      parent_id: 101,
      parent_title: 'Pengenalan APD',
      title: 'Cara Pemakaian Helm & Sarung Tangan',
      slug: 'cara-pemakaian-helm-sarung-tangan',
      excerpt: 'Langkah pemakaian yang benar.',
      content: '<p>Detail langkah pemakaian.</p>',
      estimated_minutes: 10,
      position: 1,
      view_count: 80,
      children_count: 0,
      created_at: '02 Agu 2026',
      updated_at: '02 Agu 2026',
    },
    {
      id: 103,
      learning_path_id: 1,
      parent_id: null,
      parent_title: null,
      title: 'Prosedur Tanggap Darurat',
      slug: 'prosedur-tanggap-darurat',
      excerpt: 'Langkah saat terjadi kondisi darurat di area kerja.',
      content: '<p>Materi tanggap darurat.</p>',
      estimated_minutes: 20,
      position: 2,
      view_count: 95,
      children_count: 0,
      created_at: '03 Agu 2026',
      updated_at: '03 Agu 2026',
    },
  ],
  2: [
    {
      id: 201,
      learning_path_id: 2,
      parent_id: null,
      parent_title: null,
      title: 'Sejarah Koperasi Merah Putih',
      slug: 'sejarah-koperasi-merah-putih',
      excerpt: 'Latar belakang dan tujuan pembentukan.',
      content: '<p>Sejarah koperasi.</p>',
      estimated_minutes: 12,
      position: 1,
      view_count: 210,
      children_count: 0,
      created_at: '01 Agu 2026',
      updated_at: '01 Agu 2026',
    },
  ],
  3: [],
  4: [],
}

export function getLearningPathById(id) {
  return LEARNING_PATHS.find((path) => String(path.id) === String(id)) ?? null
}

export function getModulesByLearningPathId(id) {
  return LEARNING_PATH_MODULES[id] ?? []
}

export function getModuleById(learningPathId, moduleId) {
  const modules = getModulesByLearningPathId(learningPathId)
  return modules.find((item) => String(item.id) === String(moduleId)) ?? null
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
