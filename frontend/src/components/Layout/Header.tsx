import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="relative z-10 border-b border-neon-bright/30 bg-dark-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-wide text-neon-bright text-glow transition hover:text-neon-lime md:text-2xl"
        >
          Portal Gun Character Lab
        </Link>
        <nav className="flex gap-6">
          <Link
            to="/"
            className="font-display text-sm font-medium text-neon/90 transition hover:text-neon-bright hover:shadow-neon-sm"
          >
            Inicio
          </Link>
          <Link
            to="/characters"
            className="font-display text-sm font-medium text-neon/90 transition hover:text-neon-bright hover:shadow-neon-sm"
          >
            Personajes
          </Link>
        </nav>
      </div>
    </header>
  )
}
