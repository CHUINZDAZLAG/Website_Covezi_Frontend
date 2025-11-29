let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = import.meta.env.VITE_API_URL || 'https://covezi-backend-2.onrender.com'
}
export const API_ROOT = apiRoot
export const API_ENDPOINT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}