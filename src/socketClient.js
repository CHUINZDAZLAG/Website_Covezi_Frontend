// Socket.io client instance
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'

export const socketIoInstance = io(API_ROOT, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: false // Don't auto-connect on load
})

// Error handling
socketIoInstance.on('connect_error', (error) => {
  console.warn('[Socket.IO] Connection error:', error.message)
})

socketIoInstance.on('error', (error) => {
  console.warn('[Socket.IO] Error:', error)
})

socketIoInstance.on('connect', () => {
  console.log('[Socket.IO] Connected:', socketIoInstance.id)
})

socketIoInstance.on('disconnect', (reason) => {
  console.warn('[Socket.IO] Disconnected:', reason)
})

