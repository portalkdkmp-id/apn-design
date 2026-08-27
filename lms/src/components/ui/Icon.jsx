import { BookOpen, CheckSquare, FileText, Library } from 'lucide-react'

const icons = { book: BookOpen, check: CheckSquare, file: FileText, library: Library }

export function FeatureIcon({ name }) {
  const Icon = icons[name] ?? BookOpen
  return <Icon size={22} strokeWidth={2} />
}
