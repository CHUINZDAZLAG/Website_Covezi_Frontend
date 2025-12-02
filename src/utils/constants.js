// Production backend URL - always use this in production
const PRODUCTION_API = 'https://website-covezi-backend-1.onrender.com'
const LOCAL_API = 'http://localhost:8017'

// Detect environment and set API root
// In Vite: import.meta.env.DEV is true in dev, false in production build
let apiRoot = import.meta.env.DEV ? LOCAL_API : PRODUCTION_API

// Allow override via env variable
if (import.meta.env.VITE_API_URL) {
  apiRoot = import.meta.env.VITE_API_URL
}

export const API_ROOT = apiRoot
export const API_ENDPOINT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}