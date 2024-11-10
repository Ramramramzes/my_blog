import { useLocation, Navigate } from 'react-router-dom'

export const RequireAuth = ({ children }) => {
  const location = useLocation()
  
  if (localStorage.getItem('accessToken') === null) {
    return <Navigate to={'/login'} state={{ from: location }} />
  }
  return children
}
