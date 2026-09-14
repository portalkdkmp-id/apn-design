import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, ChevronRight } from 'lucide-react'

export function LearningPathModuleSidebar({ learningPathId, modules = [], activeModuleId = null }) {
  return (
    <aside className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/20">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#c81e2a]" />
          <span className="text-sm font-semibold uppercase tracking-wide text-black/70 dark:text-white/70">
            Modul Learning Path
          </span>
        </div>
      </div>

      <nav className="space-y-2">
        {modules.map((module) => {
          const isActive = String(activeModuleId) === String(module.id)
          const isCompleted = Boolean(module.completed)

          return (
            <Link
              key={module.id}
              to={`/learning-paths/${learningPathId}/modules/${module.id}`}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition',
                isActive
                  ? 'bg-[#c81e2a] text-white shadow-sm'
                  : 'text-black/70 hover:bg-black/5 hover:text-[#c81e2a] dark:text-white/70 dark:hover:bg-white/5',
              ].join(' ')}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/40">
                {isCompleted ? <CheckCircle2 size={14} /> : <BookOpen size={14} />}
              </span>
              <span className="flex-1 truncate">{module.title}</span>
              <ChevronRight size={14} className={isActive ? 'text-white' : 'text-current/50'} />
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
