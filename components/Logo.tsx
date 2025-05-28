import { BookText } from 'lucide-react'

export default function Logo({ className = '', size = 'default' }: { className?: string; size?: 'default' | 'large' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BookText className={size === 'large' ? 'w-10 h-10' : 'w-6 h-6'} />
      <span className={`font-semibold ${size === 'large' ? 'text-2xl' : 'text-xl'}`}>
        Quick Notes
      </span>
    </div>
  )
} 