import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import BookWorkspace from './pages/BookWorkspace'
import Notes from './pages/Notes'
import Layout from './components/layout/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:bookId" element={<BookWorkspace />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
