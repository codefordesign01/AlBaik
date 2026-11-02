import { useState } from 'react'

export default function FoodImage({ src, alt, emoji = '🍔', className = '' }) {
  const [bad, setBad] = useState(false)
  if (!src || bad) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-500 to-sun-500 ${className}`} role="img" aria-label={alt}>
        <span className="text-6xl drop-shadow-lg">{emoji}</span>
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />
}
