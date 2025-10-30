/**
 * Token utility functions for managing JWT authentication
 * Handles token expiration checking and validation
 */

/**
 * Check if access token is expired
 * @returns {boolean} true if token is expired, false otherwise
 */
export const isTokenExpired = () => {
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')
  if (!tokenExpiresAt) return true

  const expiresAtTime = parseInt(tokenExpiresAt, 10)
  const currentTime = Date.now()

  // Token expired if current time is past expiration time
  return currentTime >= expiresAtTime
}

/**
 * Get time remaining until token expires (in milliseconds)
 * @returns {number} milliseconds until expiration, or 0 if expired
 */
export const getTimeUntilExpiration = () => {
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')
  if (!tokenExpiresAt) return 0

  const expiresAtTime = parseInt(tokenExpiresAt, 10)
  const currentTime = Date.now()
  const timeRemaining = expiresAtTime - currentTime

  return timeRemaining > 0 ? timeRemaining : 0
}

/**
 * Get formatted time remaining until token expires
 * @returns {string} formatted time like "55 minutes", "2 hours", etc.
 */
export const getFormattedTimeUntilExpiration = () => {
  const timeRemaining = getTimeUntilExpiration()

  if (timeRemaining === 0) {
    return 'Expired'
  }

  const minutes = Math.floor(timeRemaining / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return 'Expiring soon'
  }
}

/**
 * Get login information
 * @returns {object} object with loginTime, expiresAt, and remaining time info
 */
export const getLoginInfo = () => {
  const loginTime = localStorage.getItem('loginTime')
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')

  if (!loginTime || !tokenExpiresAt) {
    return null
  }

  return {
    loginTime: parseInt(loginTime, 10),
    expiresAt: parseInt(tokenExpiresAt, 10),
    loginDate: new Date(parseInt(loginTime, 10)).toLocaleString('vi-VN'),
    expiresDate: new Date(parseInt(tokenExpiresAt, 10)).toLocaleString('vi-VN'),
    timeRemaining: getFormattedTimeUntilExpiration(),
    isExpired: isTokenExpired()
  }
}

/**
 * Check if token will expire soon (within 5 minutes)
 * @returns {boolean} true if token expiring soon, false otherwise
 */
export const isTokenExpiringSoon = () => {
  const timeRemaining = getTimeUntilExpiration()
  const FIVE_MINUTES = 5 * 60 * 1000

  return timeRemaining > 0 && timeRemaining <= FIVE_MINUTES
}

/**
 * Check if 24 hours have passed since last daily login
 * @returns {boolean} true if 24+ hours have passed, false otherwise
 */
export const shouldClaimDailyLogin = () => {
  const lastDailyLoginTime = localStorage.getItem('lastDailyLoginTime')
  
  // First time logging in today
  if (!lastDailyLoginTime) {
    return true
  }

  const lastLoginTime = parseInt(lastDailyLoginTime, 10)
  const currentTime = Date.now()
  const timeSinceLastLogin = currentTime - lastLoginTime
  
  // 24 hours in milliseconds
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
  
  return timeSinceLastLogin >= TWENTY_FOUR_HOURS
}

/**
 * Get time remaining until next daily login reward is available
 * @returns {number} milliseconds until next daily login, or 0 if ready
 */
export const getTimeUntilNextDailyLogin = () => {
  const lastDailyLoginTime = localStorage.getItem('lastDailyLoginTime')
  
  if (!lastDailyLoginTime) {
    return 0 // Can claim immediately
  }

  const lastLoginTime = parseInt(lastDailyLoginTime, 10)
  const currentTime = Date.now()
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
  const nextAvailableTime = lastLoginTime + TWENTY_FOUR_HOURS
  const timeRemaining = nextAvailableTime - currentTime

  return timeRemaining > 0 ? timeRemaining : 0
}

/**
 * Get formatted time until next daily login reward
 * @returns {string} formatted time like "18 hours", "45 minutes", etc.
 */
export const getFormattedTimeUntilNextDailyLogin = () => {
  const timeRemaining = getTimeUntilNextDailyLogin()

  if (timeRemaining === 0) {
    return 'Ready to claim'
  }

  const minutes = Math.floor(timeRemaining / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hours`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minutes`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return 'Ready to claim'
  }
}

/**
 * Record a daily login claim (saves current time to localStorage)
 */
export const recordDailyLoginClaim = () => {
  localStorage.setItem('lastDailyLoginTime', Date.now().toString())
}

