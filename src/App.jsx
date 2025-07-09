import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Route, Routes, Navigate } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/* Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm
      trong history của Browser

      Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình
      duyệt giữa 2 trường hợp có replace hoặc không có. */}
      <Route path='' element={
        <Navigate to='/boards/6869e0adf7ffbaf72c77a7df' replace={true} />
      } />
      {/* Board details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
