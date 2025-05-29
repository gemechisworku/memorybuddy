import { BookText } from 'lucide-react'

export default function Logo({ className = '', size = 'default' }: { className?: string; size?: 'default' | 'large' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BookText className={`${size === 'large' ? 'w-10 h-10' : 'w-6 h-6'} text-blue-600 dark:text-blue-400`} />
      <span className={`font-semibold ${size === 'large' ? 'text-2xl' : 'text-xl'} text-gray-900 dark:text-white`}>
        MemoryBuddy
      </span>
    </div>
  )
} 