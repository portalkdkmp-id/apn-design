import { QUIZ_MODULES } from './quizModules'
import { QUESTIONS } from './questions'

// Mock pengganti tabel `quiz_attempts` di backend, disimpan di localStorage.
// Bentuk fungsi & payload sengaja meniru `QuizModuleService` /
// `QuizAttemptService` di lms_apn.

const STORAGE_KEY = 'apn_quiz_attempts'

function readAttempts() {
  if (typeof localStorage === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeAttempts(attempts) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
}

function formatDateTime(iso) {
  if (!iso) return null
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function questionsForModule(quizModule) {
  return quizModule.question_ids
    .map((id) => QUESTIONS.find((question) => question.id === id))
    .filter(Boolean)
}

// Aturan akses disederhanakan: modul ujian yang `status: 'published'`
// dianggap tersedia untuk manager/staff yang sudah login.
function isAccessible(quizModule) {
  return quizModule.status === 'published'
}

function attemptsForUserAndModule(userId, quizModuleId) {
  return readAttempts().filter(
    (attempt) => String(attempt.user_id) === String(userId) && String(attempt.quiz_module_id) === String(quizModuleId),
  )
}

function summarizeModuleForUser(userId, quizModule) {
  const attempts = attemptsForUserAndModule(userId, quizModule.id)
  const submitted = attempts.filter((attempt) => attempt.status === 'submitted')
  const inProgress = attempts.find((attempt) => attempt.status === 'in_progress')
  const latest = submitted.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))[0] ?? null

  return {
    id: quizModule.id,
    title: quizModule.title,
    description: quizModule.description,
    passing_score: quizModule.passing_score,
    duration_minutes: quizModule.duration_minutes,
    max_attempts: quizModule.max_attempts,
    status: quizModule.status,
    role_names: quizModule.role_names,
    questions_count: quizModule.questions_count,
    max_score: quizModule.max_score,
    attempts_used: submitted.length,
    remaining_attempts: Math.max(0, quizModule.max_attempts - submitted.length),
    can_start: submitted.length < quizModule.max_attempts,
    in_progress_attempt_id: inProgress?.id ?? null,
    has_completed_attempt: submitted.length > 0,
    latest_attempt_score: latest?.score ?? null,
    latest_attempt_passed: latest ? latest.score >= quizModule.passing_score : null,
    latest_attempt_submitted_at: latest ? formatDateTime(latest.submitted_at) : null,
  }
}

export function getAccessibleQuizModulesForUser(userId, { search = '' } = {}) {
  const query = search.trim().toLowerCase()

  return QUIZ_MODULES.filter(isAccessible)
    .filter((quizModule) => !query || quizModule.title.toLowerCase().includes(query))
    .map((quizModule) => summarizeModuleForUser(userId, quizModule))
}

export function getModuleIntroPayload(userId, quizModuleId) {
  const quizModule = QUIZ_MODULES.find((item) => String(item.id) === String(quizModuleId))
  if (!quizModule) return null

  return { module: summarizeModuleForUser(userId, quizModule) }
}

export function startAttempt(userId, quizModuleId) {
  const quizModule = QUIZ_MODULES.find((item) => String(item.id) === String(quizModuleId))
  if (!quizModule) return null

  const attempts = readAttempts()
  const existingInProgress = attempts.find(
    (attempt) =>
      String(attempt.user_id) === String(userId) &&
      String(attempt.quiz_module_id) === String(quizModuleId) &&
      attempt.status === 'in_progress',
  )
  if (existingInProgress) return existingInProgress

  const attemptNumber = attempts.filter(
    (attempt) => String(attempt.user_id) === String(userId) && String(attempt.quiz_module_id) === String(quizModuleId),
  ).length + 1

  const attempt = {
    id: `${Date.now()}`,
    user_id: userId,
    quiz_module_id: quizModule.id,
    attempt_number: attemptNumber,
    duration_minutes: quizModule.duration_minutes,
    started_at: new Date().toISOString(),
    submitted_at: null,
    status: 'in_progress',
    answers: {},
    score: null,
  }

  writeAttempts([...attempts, attempt])
  return attempt
}

export function getAttempt(attemptId) {
  return readAttempts().find((attempt) => String(attempt.id) === String(attemptId)) ?? null
}

export function saveAttemptAnswers(attemptId, answers) {
  const attempts = readAttempts()
  const next = attempts.map((attempt) => (String(attempt.id) === String(attemptId) ? { ...attempt, answers } : attempt))
  writeAttempts(next)
}

export function getAttemptQuestions(attempt) {
  const quizModule = QUIZ_MODULES.find((item) => item.id === attempt.quiz_module_id)
  if (!quizModule) return []
  return questionsForModule(quizModule)
}

export function submitAttempt(attemptId, answers) {
  const attempts = readAttempts()
  const attempt = attempts.find((item) => String(item.id) === String(attemptId))
  if (!attempt) return null

  const quizModule = QUIZ_MODULES.find((item) => item.id === attempt.quiz_module_id)
  const questions = questionsForModule(quizModule)

  let score = 0
  let answeredCount = 0

  questions.forEach((question) => {
    const answer = answers[String(question.id)]
    if (!answer) return

    if (question.type === 'multiple_choice') {
      if (answer.selected_option_id) {
        answeredCount += 1
        const option = question.options.find((opt) => String(opt.id) === String(answer.selected_option_id))
        if (option?.is_correct) score += question.weight
      }
    } else if (question.type === 'true_false') {
      if (answer.selected_boolean === 'true' || answer.selected_boolean === 'false') {
        answeredCount += 1
        const selected = answer.selected_boolean === 'true'
        if (selected === question.correct_boolean_answer) score += question.weight
      }
    }
  })

  const submittedAt = new Date().toISOString()
  const updated = {
    ...attempt,
    answers,
    score,
    answered_count: answeredCount,
    question_count: questions.length,
    status: 'submitted',
    submitted_at: submittedAt,
  }

  writeAttempts(attempts.map((item) => (String(item.id) === String(attemptId) ? updated : item)))
  return updated
}

export function getAttemptResultPayload(attemptId) {
  const attempt = getAttempt(attemptId)
  if (!attempt || attempt.status !== 'submitted') return null

  const quizModule = QUIZ_MODULES.find((item) => item.id === attempt.quiz_module_id)
  if (!quizModule) return null

  const startedAt = new Date(attempt.started_at)
  const submittedAt = new Date(attempt.submitted_at)
  const elapsedSeconds = Math.max(0, Math.round((submittedAt - startedAt) / 1000))
  const elapsed = [
    Math.floor(elapsedSeconds / 3600),
    Math.floor((elapsedSeconds % 3600) / 60),
    elapsedSeconds % 60,
  ]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')

  return {
    attempt: {
      id: attempt.id,
      attempt_number: attempt.attempt_number,
      score: attempt.score,
      max_score: quizModule.max_score,
      passed: attempt.score >= quizModule.passing_score,
      passing_score: quizModule.passing_score,
      duration_minutes: quizModule.duration_minutes,
      elapsed,
      answered_count: attempt.answered_count,
      question_count: attempt.question_count,
      started_at: formatDateTime(attempt.started_at),
      submitted_at: formatDateTime(attempt.submitted_at),
    },
    module: {
      id: quizModule.id,
      title: quizModule.title,
      description: quizModule.description,
    },
  }
}
