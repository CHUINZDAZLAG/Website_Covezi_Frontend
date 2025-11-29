let apiRoot = ''

// Use import.meta.env instead of process.env for Vite
if (import.meta.env.DEV) {
  apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:8017'
}
if (import.meta.env.PROD) {
  apiRoot = import.meta.env.VITE_API_URL || 'https://covezi-backend-2.onrender.com'
}

// Fallback if apiRoot is still empty (should not happen)
if (!apiRoot) {
  apiRoot = 'https://covezi-backend-2.onrender.com'
}

export const API_ROOT = apiRoot
export const API_ENDPOINT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}