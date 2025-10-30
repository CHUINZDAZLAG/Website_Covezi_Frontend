import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

// Initialize value of a Slice in Redux
const initialState = {
  currentUser: null
}

// Actions to call api (asynchronous) and update data to Redux, use middleware createAsyncThunk go with extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // Axios return json data in response.data
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)

// Initialize a Slide in Redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: handle synchronous data
  reducers: {},
  // ExtraReducers: handle asynchronous data
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
      // Save token to localStorage if it exists
      // The response includes accessToken from backend login endpoint
      if (user?.accessToken) {
        localStorage.setItem('accessToken', user.accessToken)
        // Save login timestamp (current time in milliseconds)
        localStorage.setItem('loginTime', Date.now().toString())
        // Token expires in 1 hour (3600000ms), so calculate expiration time
        localStorage.setItem('tokenExpiresAt', (Date.now() + 3600000).toString())
        // Also set it in axios headers immediately
        authorizedAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`
      }
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
    /**
     * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
     * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
     */
      state.currentUser = null
      // Clear all authentication data from localStorage on logout
      localStorage.removeItem('accessToken')
      localStorage.removeItem('loginTime')
      localStorage.removeItem('tokenExpiresAt')
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action creators are generated for each case reducer function
// Action là nơi dành cho các components bên dưới gọi bằng dispathch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Thuộc tính actions sẽ được redux tạo tự động theo tên của reducer
// export const {} = userSlice.actions

// Selectors: child components call by hook useSelector() to get data in redux store
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

// This file name is activeBoardSlide but we will export one thing called Reducer
export const userReducer = userSlice.reducer