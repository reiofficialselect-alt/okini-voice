import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import PublicVoice from './pages/PublicVoice'
import ReviewDetail from './pages/ReviewDetail'
import Login from './pages/Login'
import Submit from './pages/Submit'
import Admin from './pages/Admin'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicVoice />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
