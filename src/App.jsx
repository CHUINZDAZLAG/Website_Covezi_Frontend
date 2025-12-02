import Homepage from '~/pages/Homepage/Homepage'
import Products from '~/pages/Products/Products'
import ProductDetailReal from '~/pages/Products/ProductDetailReal'
import AdminProductManagement from '~/pages/Admin/AdminProductManagement'
import AdminDashboard from '~/pages/Admin/AdminDashboard'
import Orders from '~/pages/Orders/Orders'
import OrderDetail from '~/pages/Orders/OrderDetail'
import Challenges from '~/pages/Challenges/Challenges'
import ChallengeDetail from '~/pages/Challenges/ChallengeDetail'
import CreateChallenge from '~/pages/Challenges/CreateChallenge'
import EditChallenge from '~/pages/Challenges/EditChallenge'
import Garden from '~/pages/Garden/Garden'
import Leaderboard from '~/pages/Leaderboard/Leaderboard'
import MyVouchers from '~/pages/Voucher/MyVouchers'
import NotFound from '~/pages/404/NotFound'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'
import Board from '~/pages/Boards/_id'
import { useEffect } from 'react'
import { gamificationAPI } from '~/apis'
import { shouldClaimDailyLogin, recordDailyLoginClaim } from '~/utils/tokenUtils'
import ChatBot from '~/components/ChatBot/ChatBot'

/**
 * Protected route component using React Router's Outlet
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

/**
 * Admin Protected route component
 * Redirects non-admin users to home page
 */
const AdminProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  // Check if user is admin by role or email
  const isAdmin = user.role === 'admin' || user.email?.includes('admin')
  if (!isAdmin) return <Navigate to='/' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  // Automatically claim daily login reward if 24 hours have passed
  useEffect(() => {
    const claimDailyLoginIfEligible = async () => {
      // Only process if user is logged in
      if (!currentUser) return

      // Check if 24 hours have passed since last login
      if (shouldClaimDailyLogin()) {
        try {
          const response = await gamificationAPI.claimDailyLoginReward()
          if (response?.data) {
            // Record this claim
            recordDailyLoginClaim()
          }
        } catch (error) {
          // Silent fail - daily login might already be claimed or other reasons
          console.debug('Daily login claim result:', error.response?.data?.message || 'Already claimed today')
        }
      }
    }

    claimDailyLoginIfEligible()
  }, [currentUser])

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='' element={<Homepage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetailReal />} />
        <Route path='/challenges' element={<Challenges />} />
        <Route path='/challenges/create' element={<CreateChallenge />} />
        <Route path='/challenges/edit/:id' element={<EditChallenge />} />
        <Route path='/challenges/:id' element={<ChallengeDetail />} />

        {/* Authentication routes */}
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/account/verification' element={<AccountVerification />} />

        {/* Protected Routes - require authentication */}
        <Route element={<ProtectedRoute user={currentUser}/>}>
          {/* User dashboard */}
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<OrderDetail />} />
          <Route path='/garden' element={<Garden />} />
          <Route path='/vouchers' element={<MyVouchers />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          
          {/* User settings */}
          <Route path='/settings/account' element={<Settings />} />
          <Route path='/settings/security' element={<Settings />} />
          
          {/* Legacy Trello routes - giữ để tránh conflict */}
          <Route path='/boards/:boardId' element={<Board />} />
          <Route path='/boards/' element={<Boards />} />
        </Route>

        {/* Admin Protected Routes - require authentication + admin role */}
        <Route element={<AdminProtectedRoute user={currentUser}/>}>
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/products' element={<AdminProductManagement />} />
        </Route>

        {/* 404 page */}
        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* ChatBot available on all pages for authenticated users */}
      <ChatBot />
    </>
  )
}

export default App
