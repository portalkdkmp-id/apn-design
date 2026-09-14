export function Modal({ open, onClose, title, description, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button
        aria-label="Tutup"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <div
        className="
          relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border
          border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#1d1d1d]
        "
      >
        {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
        {description ? (
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">{description}</p>
        ) : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
