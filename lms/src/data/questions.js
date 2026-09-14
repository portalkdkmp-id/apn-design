export const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Pilihan ganda' },
  { value: 'true_false', label: 'True / False' },
]

export const LEARNING_PATH_OPTIONS = [
  { id: 1, title: 'Onboarding Keselamatan Kerja' },
  { id: 2, title: 'Dasar-Dasar Koperasi Merah Putih' },
  { id: 3, title: 'Manajemen Simpan Pinjam' },
  { id: 4, title: 'Etika dan Kepatuhan Anggota' },
]

export const DIFFICULTIES = [
  { id: 1, name: 'Mudah', point: 5, questions_count: 18, created_at: '02 Agu 2026' },
  { id: 2, name: 'Sedang', point: 10, questions_count: 24, created_at: '02 Agu 2026' },
  { id: 3, name: 'Sulit', point: 15, questions_count: 9, created_at: '05 Agu 2026' },
]

export const QUESTION_STATS = [
  { label: 'Total Soal', value: 51, description: 'Seluruh soal di bank soal.' },
  { label: 'Pilihan Ganda', value: 39, description: 'Soal bertipe pilihan ganda.' },
  { label: 'True / False', value: 12, description: 'Soal bertipe benar / salah.' },
  { label: 'Learning Path', value: 4, description: 'Learning path yang punya soal.' },
  { label: 'Difficulty', value: 3, description: 'Tingkat kesulitan aktif.' },
]

export const QUESTIONS = [
  {
    id: 1,
    learning_path_id: 1,
    learning_path_title: 'Onboarding Keselamatan Kerja',
    question_difficulty_id: 1,
    difficulty_name: 'Mudah',
    difficulty_point: 5,
    type: 'multiple_choice',
    prompt: 'Apa yang harus dilakukan pertama kali saat mendengar alarm kebakaran?',
    explanation: 'Alarm kebakaran adalah tanda untuk segera evakuasi melalui jalur terdekat.',
    weight: 5,
    position: 1,
    correct_boolean_answer: null,
    options: [
      { id: 1, text: 'Menuju titik kumpul melalui jalur evakuasi terdekat', is_correct: true, position: 1 },
      { id: 2, text: 'Mengambil barang pribadi terlebih dahulu', is_correct: false, position: 2 },
      { id: 3, text: 'Menunggu instruksi lanjutan di tempat', is_correct: false, position: 3 },
      { id: 4, text: 'Menggunakan lift untuk turun lebih cepat', is_correct: false, position: 4 },
    ],
    created_at: '03 Agu 2026',
  },
  {
    id: 2,
    learning_path_id: 1,
    learning_path_title: 'Onboarding Keselamatan Kerja',
    question_difficulty_id: 2,
    difficulty_name: 'Sedang',
    difficulty_point: 10,
    type: 'true_false',
    prompt: 'Alat pelindung diri (APD) hanya wajib digunakan di area produksi.',
    explanation: 'APD wajib digunakan di seluruh area yang telah ditetapkan, tidak hanya area produksi.',
    weight: 10,
    position: 2,
    correct_boolean_answer: false,
    options: [],
    created_at: '03 Agu 2026',
  },
  {
    id: 3,
    learning_path_id: 2,
    learning_path_title: 'Dasar-Dasar Koperasi Merah Putih',
    question_difficulty_id: 1,
    difficulty_name: 'Mudah',
    difficulty_point: 5,
    type: 'multiple_choice',
    prompt: 'Prinsip koperasi yang menekankan bahwa keanggotaan bersifat sukarela dan terbuka disebut?',
    explanation: null,
    weight: 5,
    position: 1,
    correct_boolean_answer: null,
    options: [
      { id: 5, text: 'Keanggotaan sukarela dan terbuka', is_correct: true, position: 1 },
      { id: 6, text: 'Pembagian sisa hasil usaha secara adil', is_correct: false, position: 2 },
      { id: 7, text: 'Kemandirian koperasi', is_correct: false, position: 3 },
    ],
    created_at: '04 Agu 2026',
  },
  {
    id: 4,
    learning_path_id: 3,
    learning_path_title: 'Manajemen Simpan Pinjam',
    question_difficulty_id: 3,
    difficulty_name: 'Sulit',
    difficulty_point: 15,
    type: 'true_false',
    prompt: 'Bunga simpan pinjam koperasi wajib mengikuti suku bunga bank umum.',
    explanation: 'Bunga simpan pinjam koperasi diatur melalui musyawarah anggota, bukan mengikuti bank umum.',
    weight: 15,
    position: 1,
    correct_boolean_answer: false,
    options: [],
    created_at: '06 Agu 2026',
  },
]