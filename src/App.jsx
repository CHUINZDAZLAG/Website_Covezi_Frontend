import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'

/**
 * Protected route component using React Router's Outlet
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect root path to boards */}
      <Route path='' element={
        <Navigate to='/boards' replace={true} />
      } />

      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* Board routes */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards/' element={<Boards />} />

        {/* User settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Authentication routes */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
