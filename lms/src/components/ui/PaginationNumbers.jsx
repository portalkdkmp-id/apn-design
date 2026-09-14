import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PaginationNumbers({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null

  const pages = Array.from({ length: lastPage }, (_, index) => index + 1)

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="grid size-8 place-items-center rounded-lg text-black/50 hover:bg-black/5 disabled:opacity-30 dark:text-white/50 dark:hover:bg-white/10"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`
            grid size-8 place-items-center rounded-lg text-sm
            ${
              page === currentPage
                ? 'bg-[#c81e2a] text-white'
                : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="grid size-8 place-items-center rounded-lg text-black/50 hover:bg-black/5 disabled:opacity-30 dark:text-white/50 dark:hover:bg-white/10"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default PaginationNumbers
