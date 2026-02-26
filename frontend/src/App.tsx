import toast, { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useApiHandlers } from './hooks/useApiLoading'
import { Characters } from './pages/Characters'
import { Home } from './pages/Home'

function App() {
  const apiLoading = useApiHandlers({
    onError: (message) => toast.error(message),
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="characters" element={<Characters />} />
        </Route>
      </Routes>
      {apiLoading && (
        <div
          className="fixed left-0 top-0 z-[100] h-1 w-full animate-pulse bg-neon-bright/80"
          aria-hidden
        />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-dark-bg !text-neon-bright !border !border-neon-bright/30',
          style: {
            background: '#0a0f0a',
            color: '#39ff14',
            border: '1px solid rgba(57, 255, 20, 0.3)',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
