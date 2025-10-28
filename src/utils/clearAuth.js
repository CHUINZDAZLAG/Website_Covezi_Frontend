// Utility to manually clear all authentication data
export const clearAuthData = () => {
  // Clear all cookies
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim()
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
  
  // Clear localStorage
  localStorage.clear()
  
  // Clear sessionStorage
  sessionStorage.clear()
  
  console.log('All auth data cleared')
}

// Add to window for console access
if (typeof window !== 'undefined') {
  window.clearAuthData = clearAuthData
}
