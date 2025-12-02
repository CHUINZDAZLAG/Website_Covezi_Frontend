// Socket.io client instance
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'

let socketIoInstance = null

const initializeSocket = () => {
  if (!socketIoInstance) {
    try {
      socketIoInstance = io(API_ROOT, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        withCredentials: true,
        autoConnect: false
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
    } catch (error) {
      console.error('[Socket.IO] Failed to initialize:', error)
      socketIoInstance = null
    }
  }

  return socketIoInstance
}

// Initialize socket on module load
initializeSocket()

export { socketIoInstance, initializeSocket }


