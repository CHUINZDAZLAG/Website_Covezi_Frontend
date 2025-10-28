/**
 * Gamification Event Management
 * Handles XP gains, level-ups, and voucher notifications
 */

export const addGameNotification = (notification) => {
  const events = JSON.parse(localStorage.getItem('gamificationEvents') || '[]')
  
  // Add timestamp if not present
  const event = {
    ...notification,
    timestamp: notification.timestamp || new Date().toISOString(),
    id: `${Date.now()}-${Math.random()}`
  }
  
  events.unshift(event)
  
  // Keep only last 50 notifications
  if (events.length > 50) {
    events.pop()
  }
  
  localStorage.setItem('gamificationEvents', JSON.stringify(events))
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('gamificationEvent', { detail: event }))
}

export const createXpNotification = (xpGained, action, currentXp, nextLevelXp) => {
  return {
    type: 'xp_gain',
    xpGained,
    action,
    currentXp,
    nextLevelXp,
    timestamp: new Date().toISOString()
  }
}

export const createLevelUpNotification = (newLevel, treeStageUpgrade = null, landUnlock = null) => {
  return {
    type: 'level_up',
    newLevel,
    treeStageUpgrade,
    landUnlock,
    timestamp: new Date().toISOString()
  }
}

export const createVoucherNotification = (discount, level, voucherCode, expiresAt) => {
  return {
    type: 'voucher_earned',
    discount,
    level,
    voucherCode,
    expiresAt,
    timestamp: new Date().toISOString()
  }
}

export const createChallengeCompleteNotification = (challengeName, xpGained) => {
  return {
    type: 'challenge_complete',
    challengeName,
    xpGained,
    timestamp: new Date().toISOString()
  }
}

export const getGameNotifications = () => {
  return JSON.parse(localStorage.getItem('gamificationEvents') || '[]')
}

export const clearGameNotifications = () => {
  localStorage.removeItem('gamificationEvents')
}

export const removeGameNotification = (id) => {
  const events = JSON.parse(localStorage.getItem('gamificationEvents') || '[]')
  const filtered = events.filter(e => e.id !== id)
  localStorage.setItem('gamificationEvents', JSON.stringify(filtered))
}
