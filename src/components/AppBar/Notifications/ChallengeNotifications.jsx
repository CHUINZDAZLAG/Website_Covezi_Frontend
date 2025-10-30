import { useEffect, useState } from 'react'
import {
  Box,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Button
} from '@mui/material'
import {
  NotificationsActive,
  Close,
  EmojiEvents
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketClient'
import {
  getChallengeNotifications,
  addChallengeNotification,
  removeChallengeNotification,
  clearChallengeNotifications
} from '~/utils/challengeNotificationHelper'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

function ChallengeNotifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setUnreadCount(0)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Listen for challenge notifications from backend via Socket.io
  useEffect(() => {
    if (!currentUser) return

    // Load existing notifications from localStorage
    const existingNotifications = getChallengeNotifications()
    setNotifications(existingNotifications)

    // Listen for new challenge created event
    const handleChallengeCreated = (data) => {
      const { notification } = data
      // Add to local state and localStorage
      addChallengeNotification(notification)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    }

    // Listen for challenge participant joined event
    const handleChallengeParticipant = (data) => {
      const { notification, creatorId } = data
      // Only notify the creator
      if (creatorId === currentUser._id) {
        addChallengeNotification(notification)
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
      }
    }

    socketIoInstance.on('CHALLENGE_CREATED', handleChallengeCreated)
    socketIoInstance.on('CHALLENGE_PARTICIPANT_JOINED', handleChallengeParticipant)

    return () => {
      socketIoInstance.off('CHALLENGE_CREATED', handleChallengeCreated)
      socketIoInstance.off('CHALLENGE_PARTICIPANT_JOINED', handleChallengeParticipant)
    }
  }, [currentUser])

  const handleNotificationClick = (notification) => {
    if (notification.challengeId) {
      navigate(`/challenges/${notification.challengeId}`)
      handleClose()
    }
  }

  const handleRemoveNotification = (e, notificationId) => {
    e.stopPropagation()
    removeChallengeNotification(notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const handleClearAll = () => {
    clearChallengeNotifications()
    setNotifications([])
  }

  return (
    <>
      <Tooltip title="Challenge Notifications">
        <IconButton
          onClick={handleClick}
          sx={{ position: 'relative' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive sx={{ color: '#063B71' }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '360px',
            maxHeight: '500px',
            mt: 1.5,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: 2
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              🔔 Challenge Updates
            </Typography>
            {notifications.length > 0 && (
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{ color: '#999', fontSize: '12px' }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsActive sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
            <Typography color="textSecondary">
              No challenge notifications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowY: 'auto', maxHeight: '400px' }}>
            {notifications.map((notification, index) => (
              <Box key={`notification-${notification.id}-${index}`}>
                <MenuItem
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, width: '100%', alignItems: 'flex-start' }}>
                    {/* Avatar/Icon */}
                    <Box sx={{ pt: 0.5 }}>
                      {notification.type === 'challenge_created' ? (
                        <EmojiEvents sx={{ color: '#FFD700', fontSize: 28 }} />
                      ) : (
                        <Avatar
                          src={notification.participantAvatar}
                          sx={{ width: 32, height: 32 }}
                        >
                          {notification.participantName?.[0]}
                        </Avatar>
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#000'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleRemoveNotification(e, notification.id)}
                          sx={{ p: 0, ml: 'auto' }}
                        >
                          <Close sx={{ fontSize: 16, color: '#999' }} />
                        </IconButton>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          mb: 0.5,
                          wordWrap: 'break-word'
                        }}
                      >
                        {notification.message}
                      </Typography>

                      {notification.type === 'challenge_created' && (
                        <Box sx={{ mb: 0.5 }}>
                          <Chip
                            label={`${notification.difficulty || 'Normal'} • ${notification.duration || 7} days`}
                            size="small"
                            sx={{ fontSize: '11px' }}
                          />
                        </Box>
                      )}

                      {notification.type === 'challenge_participant' && (
                        <Box sx={{ mb: 0.5 }}>
                          <Chip
                            label={`${notification.participantCount || 1} participant${(notification.participantCount || 1) !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{ fontSize: '11px' }}
                          />
                        </Box>
                      )}

                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {moment(notification.timestamp).fromNow()}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                {index < notifications.length - 1 && <Divider key={`divider-${notification.id}`} sx={{ my: 0 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Menu>
    </>
  )
}

export default ChallengeNotifications
