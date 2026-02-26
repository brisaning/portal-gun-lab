import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="gradient-bg" aria-hidden />
      <Header />
      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
