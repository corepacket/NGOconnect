import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ children, requiredType }) {
  const { isAuthenticated, userType } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredType && userType !== requiredType) {
    return <Navigate to={userType === 'ngo' ? '/dashboard/ngo' : '/dashboard/volunteer'} replace />
  }

  return children
}
