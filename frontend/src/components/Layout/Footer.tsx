export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-auto border-t border-neon-bright/20 bg-dark-bg/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-sm text-neon/80">
            Portal Gun Character Lab · Temática psicodélica · Verdes neón
          </p>
          <p className="font-sans text-xs text-neon/60">
            © {year} · Multiverso C-137
          </p>
        </div>
      </div>
    </footer>
  )
}
