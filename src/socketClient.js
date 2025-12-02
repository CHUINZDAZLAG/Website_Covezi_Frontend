// Socket.io client instance
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'

let socketIoInstance = null
let chatSocketInstance = null

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

// Chat namespace socket for ZiZi chatbot
const initializeChatSocket = () => {
  if (!chatSocketInstance) {
    try {
      chatSocketInstance = io(`${API_ROOT}/chat`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        withCredentials: true,
        autoConnect: false
      })

      // Error handling
      chatSocketInstance.on('connect_error', (error) => {
        console.warn('[Chat Socket.IO] Connection error:', error.message)
      })

      chatSocketInstance.on('error', (error) => {
        console.warn('[Chat Socket.IO] Error:', error)
      })

      chatSocketInstance.on('connect', () => {
        console.log('[Chat Socket.IO] Connected:', chatSocketInstance.id)
      })

      chatSocketInstance.on('disconnect', (reason) => {
        console.warn('[Chat Socket.IO] Disconnected:', reason)
      })
    } catch (error) {
      console.error('[Chat Socket.IO] Failed to initialize:', error)
      chatSocketInstance = null
    }
  }

  return chatSocketInstance
}

// Initialize socket on module load
initializeSocket()
initializeChatSocket()

export { socketIoInstance, initializeSocket, chatSocketInstance, initializeChatSocket }


