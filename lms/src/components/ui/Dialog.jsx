import * as React from 'react'

import { XIcon } from 'lucide-react'

import { Button } from './Button'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Dialog({ open = true, className = '', children, ...props }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30" />
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl rounded-xl bg-white p-0 shadow-xl dark:bg-slate-900',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

function DialogTrigger({ children, onClick = () => {}, ...props }) {
  return (
    <span onClick={onClick} {...props}>
      {children}
    </span>
  )
}

function DialogPortal({ children }) {
  return children
}

function DialogClose({ children, onClick = () => {}, ...props }) {
  return (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}

function DialogOverlay({ className = '', ...props }) {
  return <div className={cn('fixed inset-0 bg-black/30', className)} {...props} />
}

function DialogContent({
  className = '',
  children,
  showCloseButton = true,
  onClose = () => {},
  ...props
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <DialogOverlay />

      <div
        className={cn(
          'relative z-10 w-full max-w-[calc(100%-2rem)] rounded-xl bg-white p-6 text-sm text-slate-900 shadow-xl ring-1 ring-black/10 dark:bg-slate-900 dark:text-white dark:ring-white/10 sm:max-w-md',
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <Button
            type="button"
            variant="ghost"
            className="absolute top-4 right-4"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon size={16} />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </div>
  )
}

function DialogHeader({ className = '', ...props }) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />
}

function DialogFooter({
  className = '',
  showCloseButton = false,
  children,
  onClose = () => {},
  ...props
}) {
  return (
    <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props}>
      {children}

      {showCloseButton && (
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  )
}

function DialogTitle({ className = '', ...props }) {
  return <h2 className={cn('font-heading leading-none font-medium', className)} {...props} />
}

function DialogDescription({ className = '', ...props }) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}