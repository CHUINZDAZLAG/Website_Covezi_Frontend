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
  autoConnect: true
})

// Error handling
socketIoInstance.on('connect_error', (error) => {
  console.warn('[Socket.IO] Connection error:', error.message)
})

socketIoInstance.on('error', (error) => {
  console.warn('[Socket.IO] Error:', error)
})
