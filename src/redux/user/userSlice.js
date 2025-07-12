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
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
    /**
     * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
     * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
     */
      state.currentUser = null
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