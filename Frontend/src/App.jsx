import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import VolunteerDashboard from './pages/VolunteerDashboard'
import NGODashboard from './pages/NGODashboard'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterNGO from './pages/RegisterNGO'
import { useAuth } from './auth/AuthContext'

function DashboardRedirect() {
  const { userType } = useAuth()
  return <Navigate to={userType === 'ngo' ? '/dashboard/ngo' : '/dashboard/volunteer'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
        <Route path="dashboard/volunteer" element={<ProtectedRoute requiredType="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="dashboard/ngo" element={<ProtectedRoute requiredType="ngo"><NGODashboard /></ProtectedRoute>} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register-ngo" element={<RegisterNGO />} />
      </Route>
    </Routes>
  )
}

export default App