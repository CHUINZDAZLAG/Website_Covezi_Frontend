import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { API_ROOT } from '~/utils/constants'

/**
 * Store injection technique for using Redux store outside components
 * Called from main.jsx to inject the store into this non-component file
 */
let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Improved token retrieval with error handling and expiration check
const getValidToken = () => {
  try {
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')
    
    // Check if token exists and is not expired
    if (tokenExpiresAt) {
      const expiresAt = parseInt(tokenExpiresAt)
      const now = Date.now()
      
      // If token is expired, clean it up
      if (expiresAt <= now) {
        console.warn('[AXIOS] Token expired, clearing from storage')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('tokenExpiresAt')
        return null
      }
      
      // Token is still valid
      const token = localStorage.getItem('accessToken')
      if (token) {
        return token
      }
    }
    
    return localStorage.getItem('accessToken')
  } catch (error) {
    console.error('[AXIOS] Error retrieving token:', error)
    return null
  }
}

// Create custom Axios instance with shared configuration
let authorizedAxiosInstance = axios.create({
  baseURL: API_ROOT
})
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

  // Log file upload requests
  if (config.data instanceof FormData) {
    console.log('[AXIOS] ========== FormData Request ==========')
    console.log('[AXIOS] URL:', config.url)
    console.log('[AXIOS] Method:', config.method)
    console.log('[AXIOS] Has FormData:', true)
    console.log('[AXIOS] Headers before:', JSON.stringify(config.headers))
  }

  // Backend uses httpOnly cookies for auth, so withCredentials: true will send them automatically
  // But also support Authorization header from localStorage as fallback
  let token = getValidToken()
  
  // If no valid token in localStorage, try to get from Redux store
  if (!token && axiosReduxStore) {
    const currentUser = axiosReduxStore.getState().user.currentUser
    token = currentUser?.accessToken
    
    if (token) {
      console.log('[AXIOS] Using token from Redux store')
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('[AXIOS] Token attached to request')
  } else {
    console.warn('[AXIOS] No valid token found for request')
  }

  if (config.data instanceof FormData) {
    console.log('[AXIOS] Final config headers:', JSON.stringify(config.headers))
    console.log('[AXIOS] ========== End FormData Request ==========')
  }

  return config
}, (error) => {
  // Do something with request error
  interceptorLoadingElements(false)
  return Promise.reject(error)
})

// Promise for refresh token API to handle multiple failed requests
let refreshTokenPromise = null

// Response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Success response handler
  interceptorLoadingElements(false)

  // Log file upload responses
  if (response.config.data instanceof FormData) {
    console.log('[AXIOS] FormData response from:', response.config.url)
    console.log('[AXIOS] Status:', response.status)
    console.log('[AXIOS] Response data:', response.data)
  }

  return response
}, (error) => {
  // Error response handler
  interceptorLoadingElements(false)

  // Log file upload errors
  if (error.config?.data instanceof FormData) {
    console.error('[AXIOS] FormData request failed to:', error.config.url)
    console.error('[AXIOS] Error status:', error.response?.status)
    console.error('[AXIOS] Error message:', error.message)
    console.error('[AXIOS] Error response:', error.response?.data)
  }

  /** Automatic Refresh Token handling */
  // Case 1: 401 status - token invalid or missing, logout immediately
  if (error.response?.status === 401) {
    console.error('[AXIOS] 401 Unauthorized - Logging out')
    // Clear token from storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenExpiresAt')
    axiosReduxStore.dispatch(logoutUserAPI(false))
    return Promise.reject(error)
  }

  // Case 2: 410 GONE - Token expired, attempt refresh
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    console.log('[AXIOS] 410 Gone - Token expired, attempting refresh')
    
    // Mark this request to avoid infinite loop
    originalRequests._retry = true

    // Only create one refresh token request
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          console.log('[AXIOS] Token refreshed successfully')
          // Update token expiration time (token valid for 1 hour from refresh)
          localStorage.setItem('tokenExpiresAt', (Date.now() + 3600000).toString())
          return data?.accessToken
        })
        .catch((refreshError) => {
          console.error('[AXIOS] Token refresh failed:', refreshError.message)
          // Token refresh failed, logout user
          localStorage.removeItem('accessToken')
          localStorage.removeItem('tokenExpiresAt')
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(refreshError)
        })
        .finally(() => {
          // Always reset the promise
          refreshTokenPromise = null
        })
    }

    // Retry the original request with new token
    return refreshTokenPromise.then(() => {
      console.log('[AXIOS] Retrying original request after token refresh')
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Handle general error messages
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Show error notification except for 410 (handled above)
  if (error.response?.status !== 410) {
    console.error('[AXIOS] Error:', error.response?.status, errorMessage)
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})
export default authorizedAxiosInstance