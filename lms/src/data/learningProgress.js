import { LEARNING_PATHS, LEARNING_PATH_MODULES, getLearningPathById, getModulesByLearningPathId, getModuleById } from './learningPaths'

// Progress belajar per user disimpan di localStorage (mock pengganti tabel
// `learning_path_module_progress` di backend). Bentuk payload yang
// dikembalikan sengaja meniru `LearningPathService` di lms_apn supaya nanti
// tinggal diganti fetch ke API asli.

const STORAGE_KEY = 'apn_learning_progress'

function readAllProgress() {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeAllProgress(data) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function progressKey(userId, moduleId) {
  return `${userId}:${moduleId}`
}

export function isModuleCompleted(userId, moduleId) {
  const all = readAllProgress()
  return Boolean(all[progressKey(userId, moduleId)]?.completed_at)
}

export function getModuleProgress(userId, moduleId) {
  const all = readAllProgress()
  return all[progressKey(userId, moduleId)] ?? null
}

export function markModuleViewed(userId, moduleId) {
  const all = readAllProgress()
  const key = progressKey(userId, moduleId)
  all[key] = { ...all[key], last_viewed_at: new Date().toISOString() }
  writeAllProgress(all)
}

export function markModuleCompleted(userId, moduleId) {
  const all = readAllProgress()
  const key = progressKey(userId, moduleId)
  all[key] = { ...all[key], completed_at: new Date().toISOString() }
  writeAllProgress(all)
}

function formatDate(iso) {
  if (!iso) return null
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

// Aturan akses disederhanakan untuk mock FE ini: learning path yang
// `status: 'published'` dianggap bisa diakses oleh user yang sudah login
// (manager/staff). Pencocokan role/divisi granular akan mengikuti
// implementasi asli saat sudah tersambung ke backend.
function isAccessible(learningPath) {
  return learningPath.status === 'published'
}

function decorateModule(userId, learningPathId, module) {
  const progress = getModuleProgress(userId, module.id)
  return {
    ...module,
    completed: Boolean(progress?.completed_at),
    completed_at: formatDate(progress?.completed_at ?? null),
    last_viewed_at: formatDate(progress?.last_viewed_at ?? null),
  }
}

export function getAccessibleLearningPathsForUser(userId, { search = '' } = {}) {
  const query = search.trim().toLowerCase()

  return LEARNING_PATHS.filter(isAccessible)
    .filter((path) => !query || path.title.toLowerCase().includes(query))
    .map((path) => {
      const modules = getModulesByLearningPathId(path.id).map((module) => decorateModule(userId, path.id, module))
      const completedCount = modules.filter((module) => module.completed).length

      return {
        ...path,
        modules_count: modules.length,
        completed_modules_count: completedCount,
        progress_percentage: modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0,
      }
    })
}

export function getUserPathPayload(userId, learningPathId) {
  const learningPath = getLearningPathById(learningPathId)
  if (!learningPath) return null

  const modules = getModulesByLearningPathId(learningPathId).map((module) => decorateModule(userId, learningPathId, module))
  const completedCount = modules.filter((module) => module.completed).length

  return {
    learningPath: {
      ...learningPath,
      modules,
      completed_modules_count: completedCount,
      progress_percentage: modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0,
    },
  }
}

export function getUserModulePayload(userId, learningPathId, moduleId) {
  const learningPath = getLearningPathById(learningPathId)
  const module = getModuleById(learningPathId, moduleId)
  if (!learningPath || !module) return null

  markModuleViewed(userId, moduleId)

  const modules = getModulesByLearningPathId(learningPathId).map((item) => decorateModule(userId, learningPathId, item))
  const completedCount = modules.filter((item) => item.completed).length
  const currentIndex = modules.findIndex((item) => String(item.id) === String(moduleId))

  return {
    learningPath: {
      ...learningPath,
      modules,
      completed_modules_count: completedCount,
      progress_percentage: modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0,
    },
    module: decorateModule(userId, learningPathId, module),
    navigation: {
      previous_module_id: currentIndex > 0 ? modules[currentIndex - 1].id : null,
      next_module_id: currentIndex >= 0 && currentIndex < modules.length - 1 ? modules[currentIndex + 1].id : null,
    },
  }
}

export { LEARNING_PATH_MODULES }
