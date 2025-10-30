import { socketIoInstance } from '~/socketClient'

/**
 * Create challenge created notification
 */
export const createChallengeCreatedNotification = (challenge) => {
  return {
    id: `challenge_created_${challenge._id}_${Date.now()}`,
    type: 'challenge_created',
    title: 'New Challenge Posted',
    message: `${challenge.creatorDisplayName} posted a new challenge: "${challenge.title}"`,
    challengeId: challenge._id,
    challengeTitle: challenge.title,
    creatorName: challenge.creatorDisplayName,
    creatorAvatar: challenge.creatorAvatar,
    image: challenge.image,
    difficulty: challenge.difficulty,
    duration: challenge.duration,
    timestamp: new Date().toISOString()
  }
}

/**
 * Create challenge participant notification (when someone joins creator's challenge)
 */
export const createChallengeParticipantNotification = (challenge, participant) => {
  return {
    id: `challenge_participant_${challenge._id}_${participant.userId}_${Date.now()}`,
    type: 'challenge_participant',
    title: 'New Participant',
    message: `${participant.userDisplayName} joined your challenge "${challenge.title}"!`,
    challengeId: challenge._id,
    challengeTitle: challenge.title,
    participantName: participant.userDisplayName,
    participantAvatar: participant.userAvatar,
    participantCount: challenge.participantCount,
    timestamp: new Date().toISOString()
  }
}

/**
 * Emit new challenge created to all users
 */
export const emitChallengeCreated = (challenge) => {
  const notification = createChallengeCreatedNotification(challenge)
  socketIoInstance.emit('CHALLENGE_CREATED', {
    notification,
    challenge
  })
}

/**
 * Emit challenge participant joined to creator
 */
export const emitChallengeParticipant = (challenge, participant, creatorId) => {
  const notification = createChallengeParticipantNotification(challenge, participant)
  socketIoInstance.emit('CHALLENGE_PARTICIPANT_JOINED', {
    notification,
    challenge,
    creatorId
  })
}

/**
 * Get all challenge notifications from localStorage
 */
export const getChallengeNotifications = () => {
  const notifications = JSON.parse(localStorage.getItem('challengeNotifications') || '[]')
  return notifications
}

/**
 * Add challenge notification to localStorage
 */
export const addChallengeNotification = (notification) => {
  const notifications = getChallengeNotifications()
  notifications.unshift(notification)
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.pop()
  }
  localStorage.setItem('challengeNotifications', JSON.stringify(notifications))
}

/**
 * Remove challenge notification from localStorage
 */
export const removeChallengeNotification = (notificationId) => {
  const notifications = getChallengeNotifications()
  const filtered = notifications.filter(n => n.id !== notificationId)
  localStorage.setItem('challengeNotifications', JSON.stringify(filtered))
}

/**
 * Clear all challenge notifications
 */
export const clearChallengeNotifications = () => {
  localStorage.removeItem('challengeNotifications')
}
