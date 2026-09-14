// Mock data untuk dashboard user biasa (manager/staff), bentuknya mengikuti
// `DashboardService::userDashboardPayload()` di project lms_apn supaya nanti
// gampang disambungkan ke API asli (tinggal ganti fungsi ini jadi fetch).

const CONTINUE_LEARNING = [
  {
    id: 1,
    title: 'Laravel Fundamental',
    total_modules: 8,
    completed_modules: 5,
    remaining_modules: 3,
    progress_percentage: 63,
    last_learned_at: '12 Sep 2026',
    continue_url: '/learning-paths/1',
    has_progress: true,
  },
  {
    id: 2,
    title: 'React Basic',
    total_modules: 6,
    completed_modules: 1,
    remaining_modules: 5,
    progress_percentage: 17,
    last_learned_at: '08 Sep 2026',
    continue_url: '/learning-paths/2',
    has_progress: true,
  },
]

const COMPLETED_LEARNING = [
  {
    id: 3,
    title: 'Docker Basic',
    total_modules: 5,
    completed_modules: 5,
    remaining_modules: 0,
    progress_percentage: 100,
    last_learned_at: '30 Agu 2026',
    continue_url: '/learning-paths/3',
    has_progress: true,
  },
]

export function getUserDashboardPayload() {
  const totalModules = CONTINUE_LEARNING.reduce((sum, path) => sum + path.total_modules, 0) +
    COMPLETED_LEARNING.reduce((sum, path) => sum + path.total_modules, 0)
  const learnedModules = CONTINUE_LEARNING.reduce((sum, path) => sum + path.completed_modules, 0) +
    COMPLETED_LEARNING.reduce((sum, path) => sum + path.completed_modules, 0)

  return {
    stats: {
      active_exams_count: 3,
      learning_paths_count: CONTINUE_LEARNING.length + COMPLETED_LEARNING.length,
      modules_count: totalModules,
      completed_exams_count: 1,
      learned_modules_count: learnedModules,
    },
    completedLearning: COMPLETED_LEARNING,
    continueLearning: CONTINUE_LEARNING,
  }
}

export function getDivisionDashboardPayload(division) {
  if (!division) return null

  return {
    division,
    stats: {
      members_count: 12,
      active_learning_paths: 3,
      average_progress: 58,
    },
  }
}
