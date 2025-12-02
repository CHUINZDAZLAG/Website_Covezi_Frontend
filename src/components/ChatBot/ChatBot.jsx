import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Divider,
  CircularProgress,
  Fade,
  Tooltip,
  Chip,
  Avatar
} from '@mui/material'
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as ChatBotIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { socketIoInstance } from '~/socketClient'
import chatAPI from '~/apis/chatAPI'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import CoveziAIAvatar from '~/assets/Covezi_AI_Avatar.png'

const ChatBot = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chat session
  useEffect(() => {
    if (isOpen && !sessionId && currentUser) {
      // Connect to socket when opening chat
      if (!socketIoInstance.connected) {
        socketIoInstance.connect()
      }
      initializeChat()
    }
  }, [isOpen, currentUser, sessionId])

  // Listen for AI streaming responses
  useEffect(() => {
    socketIoInstance.on('chat:stream', (data) => {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.isComplete) {
          lastMessage.content += data.chunk
          return [...prev]
        }
        return prev
      })
    })

    socketIoInstance.on('chat:stream_end', () => {
      setLoading(false)
      // Mark last message as complete
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
          prev[prev.length - 1].isComplete = true
        }
        return [...prev]
      })
    })

    socketIoInstance.on('chat:error', (error) => {
      setLoading(false)
      toast.error('Error getting response: ' + error.message)
    })

    return () => {
      socketIoInstance.off('chat:stream')
      socketIoInstance.off('chat:stream_end')
      socketIoInstance.off('chat:error')
    }
  }, [])

  const initializeChat = async () => {
    try {
      const result = await chatAPI.createSession('ZiZi Chat')
      setSessionId(result.data._id)
      setMessages([])
    } catch (error) {
      console.warn('Chat API unavailable, using offline mode')
      // Use mock/offline mode with generated session ID
      setSessionId(`offline_${Date.now()}`)
      setMessages([])
      toast.info('🐱 ZiZi is offline, but you can still chat!')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !sessionId) return

    // Check if in offline mode
    if (sessionId === 'offline_mode') {
      toast.error('ZiZi is offline. Please try again later!')
      return
    }

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      isComplete: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // Add empty assistant message for streaming
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isComplete: false
      }])

      await chatAPI.sendMessage(sessionId, inputValue)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. ZiZi is currently offline.')
      setLoading(false)
    }
  }

  const handleClearChat = async () => {
    if (!sessionId || sessionId === 'offline_mode') return
    try {
      await chatAPI.clearChat(sessionId)
      setMessages([])
      toast.success('Chat cleared')
    } catch (error) {
      console.error('Error clearing chat:', error)
      toast.error('Failed to clear chat')
    }
  }

  const handleNewChat = async () => {
    try {
      if (sessionId && sessionId !== 'offline_mode') {
        await chatAPI.deleteSession(sessionId)
      }
      await initializeChat()
      setMessages([])
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast.error('ZiZi is currently offline')
    }
  }

  if (!currentUser) return null

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1300 }}>
      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 80,
            right: 0,
            width: 380,
            height: 550,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            mb: 2
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={CoveziAIAvatar}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)'
                }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  ZiZi Cute Meow 🐱
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Ask me anything!
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="New chat">
                <IconButton
                  size="small"
                  onClick={handleNewChat}
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear chat">
                <IconButton
                  size="small"
                  onClick={handleClearChat}
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  onClick={() => setIsOpen(false)}
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider />

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#FF8C3C',
                borderRadius: '10px',
                '&:hover': {
                  background: '#FF6B7A'
                }
              }
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#999',
                  textAlign: 'center',
                  gap: 1.5
                }}
              >
                <ChatBotIcon sx={{ fontSize: 40, color: '#FFB366' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Meow! Hi there! 🐱
                </Typography>
                <Typography variant="caption">
                  I am ZiZi! Ask me about green activities, recycling, workshops, or discounts
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                  <Chip
                    label="🌱 Green tips"
                    size="small"
                    variant="outlined"
                    onClick={() => setInputValue('Tell me about green activities')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="♻️ Recycling"
                    size="small"
                    variant="outlined"
                    onClick={() => setInputValue('How can I recycle products?')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="🎪 Workshops"
                    size="small"
                    variant="outlined"
                    onClick={() => setInputValue('Tell me about Covezi workshops')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="🏷️ Discounts"
                    size="small"
                    variant="outlined"
                    onClick={() => setInputValue('What products are on sale?')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </Box>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      gap: 1
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar
                        src={CoveziAIAvatar}
                        sx={{
                          width: 28,
                          height: 28,
                          background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)'
                        }}
                      />
                    )}
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '75%',
                        backgroundColor: msg.role === 'user' ? '#FF8C3C' : '#F0F0F0',
                        color: msg.role === 'user' ? 'white' : '#222',
                        borderRadius: 2,
                        wordWrap: 'break-word'
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                        {msg.role === 'assistant' && !msg.isComplete && (
                          <span style={{ animation: 'blink 0.7s infinite' }}>▌</span>
                        )}
                      </Typography>
                    </Paper>
                    {msg.role === 'user' && (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          background: '#FF6B7A',
                          fontSize: '1rem'
                        }}
                      >
                        👤
                      </Avatar>
                    )}
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          <Divider />

          {/* Input Area */}
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{
              p: 1.5,
              display: 'flex',
              gap: 1,
              backgroundColor: '#f9f9f9'
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#FF8C3C'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B7A'
                  }
                }
              }}
            />
            <IconButton
              type="submit"
              disabled={loading || !inputValue.trim()}
              sx={{
                background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF5566 0%, #FF7A2B 100%)'
                },
                '&:disabled': {
                  background: '#ccc'
                }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Fade>

      {/* Chat Button */}
      <Tooltip title={isOpen ? 'Close chat' : 'Chat with ZiZi!'}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 107, 122, 0.4)',
            position: 'relative',
            padding: 0,
            '&:hover': {
              boxShadow: '0 6px 16px rgba(255, 107, 122, 0.6)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Avatar
            src={CoveziAIAvatar}
            sx={{
              width: 60,
              height: 60,
              border: '2px solid white'
            }}
          />
        </IconButton>
      </Tooltip>

      <style>{`
        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
      `}</style>
    </Box>
  )
}

export default ChatBot
