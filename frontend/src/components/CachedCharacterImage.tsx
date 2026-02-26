import { memo, useState } from 'react'

const imageCache = new Set<string>()

interface CachedCharacterImageProps {
  src: string | null | undefined
  alt?: string
  fallbackLetter?: string
  className?: string
}

function CachedCharacterImageComponent({
  src,
  alt = '',
  fallbackLetter = '?',
  className = 'h-full w-full object-cover',
}: CachedCharacterImageProps) {
  const [error, setError] = useState(false)

  const handleLoad = () => {
    if (src) imageCache.add(src)
    setError(false)
  }

  const handleError = () => setError(true)

  if (!src || error) {
    return (
      <div
        className="flex h-full w-full items-center justify-center text-xl font-bold text-neon/60"
        aria-hidden
      >
        {fallbackLetter}
      </div>
    )
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  )
}

export const CachedCharacterImage = memo(CachedCharacterImageComponent)
