import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Store injection technique for using Redux store outside components
 * Called from main.jsx to inject the store into this non-component file
 */
let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Create custom Axios instance with shared configuration
let authorizedAxiosInstance = axios.create()
// Request timeout: 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// Enable credentials to send cookies with requests (for JWT tokens in httpOnly cookies)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Configure Interceptors for requests and responses
 */

// Request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Spam click blocking techniques
  interceptorLoadingElements(true)

  // Try to get token from localStorage if available and add to Authorization header
  // This supports both httpOnly cookie AND token in localStorage strategies
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Promise for refresh token API to handle multiple failed requests
let refreshTokenPromise = null

// Response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Success response handler
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Error response handler
  interceptorLoadingElements(false)

  /** Automatic Refresh Token handling */
  // Case 1: 401 status - logout immediately
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này
    // chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ngay phía trên)
    originalRequests._retry = true

    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời
    // gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Dong thoi accessToklen da nam trong httpOnly cookie (xu li phia BE)
          return data?.accessToken
        })
        .catch(() => {
          // Neu nhan bat ky loi nao tu API refresh token thi logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
        })
        .finally(() => {
          // Du API co thanh cong hay loi thi van luon luon gan refreshTokenPromise = null
          refreshTokenPromise = null
        })
    }

    // Cần trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
    /**
     * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết
     * thêm code xử lý ở đây.
     * vi du: axio.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
     * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE)
     * sau khi api refreshToken được gọi thành công.
     */

      // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để
      // gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xu li loi tap trung
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Use toastify to show any error code - except code 410 - GONE serve auto refesh token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})
export default authorizedAxiosInstance