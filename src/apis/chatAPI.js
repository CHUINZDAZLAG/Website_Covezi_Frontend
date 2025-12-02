import { authorizedAxiosInstance } from '~/utils/authorizeAxios'

const API_ENDPOINT = '/api/v1/chat'

/**
 * Chat API endpoints
 */
const chatAPI = {
  /**
   * Create a new chat session
   */
  createSession: async (title = null) => {
    const response = await authorizedAxiosInstance.post(`${API_ENDPOINT}/sessions`, {
      title
    })
    return response.data
  },

  /**
   * Get all chat sessions for current user
   */
  getSessions: async (page = 1, limit = 10) => {
    const response = await authorizedAxiosInstance.get(`${API_ENDPOINT}/sessions`, {
      params: { page, limit }
    })
    return response.data
  },

  /**
   * Get a specific chat session with messages
   */
  getSession: async (sessionId) => {
    const response = await authorizedAxiosInstance.get(`${API_ENDPOINT}/sessions/${sessionId}`)
    return response.data
  },

  /**
   * Send a message and get AI response
   * Returns stream via Socket.IO
   */
  sendMessage: async (sessionId, message) => {
    const response = await authorizedAxiosInstance.post(`${API_ENDPOINT}/messages`, {
      sessionId,
      content: message
    })
    return response.data
  },

  /**
   * Get messages in a session
   */
  getMessages: async (sessionId, page = 1, limit = 20) => {
    const response = await authorizedAxiosInstance.get(`${API_ENDPOINT}/messages/${sessionId}`, {
      params: { page, limit }
    })
    return response.data
  },

  /**
   * Delete a chat session
   */
  deleteSession: async (sessionId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ENDPOINT}/sessions/${sessionId}`)
    return response.data
  },

  /**
   * Clear chat history (soft delete all messages in session)
   */
  clearChat: async (sessionId) => {
    const response = await authorizedAxiosInstance.put(`${API_ENDPOINT}/sessions/${sessionId}/clear`, {})
    return response.data
  }
}

export default chatAPI
