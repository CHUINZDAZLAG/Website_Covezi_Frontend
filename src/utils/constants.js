// Production backend URL
const PRODUCTION_API = 'https://website-covezi-backend-1.onrender.com'
const LOCAL_API = 'http://localhost:8017'

// Force production API in production build (Vite sets import.meta.env.DEV = false)
const apiRoot = import.meta.env.DEV ? LOCAL_API : PRODUCTION_API

// Debug log to verify environment
console.log('[API] Environment:', import.meta.env.DEV ? 'DEV' : 'PROD', '| API_ROOT:', apiRoot)

export const API_ROOT = apiRoot
export const API_ENDPOINT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}