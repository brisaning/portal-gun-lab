import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Characters } from './pages/Characters'
import { Home } from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="characters" element={<Characters />} />
        </Route>
      </Routes>
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
