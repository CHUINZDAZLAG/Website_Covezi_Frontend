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
  IconButton
} from '@mui/material'
import {
  CheckCircle,
  CardGiftcard,
  Star,
  TrendingUp,
  GroupAdd,
  Favorite,
  EmojiEvents
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { gamificationAPI } from '~/apis/index'
import moment from 'moment'

function GamificationNotifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const currentUser = useSelector(selectCurrentUser)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setUnreadCount(0)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Listen for XP and level-up events from localStorage or API polling
  useEffect(() => {
    if (!currentUser) return

    const pollGamificationUpdates = async () => {
      try {
        await gamificationAPI.getUserGarden()

        // Check if we have stored game events
        const storedEvents = JSON.parse(localStorage.getItem('gamificationEvents') || '[]')

        if (storedEvents.length > 0) {
          setNotifications(prev => [...storedEvents, ...prev])
          setUnreadCount(prev => prev + storedEvents.length)
          localStorage.removeItem('gamificationEvents')
        }
      } catch (error) {
        // Silently suppress 401/403 errors during polling (auth not ready yet)
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Expected when auth not ready, don't log to console
          return
        }
        console.error('Error polling gamification updates:', error)
      }
    }

    // Poll every 30 seconds only if user exists
    const interval = setInterval(pollGamificationUpdates, 30000)

    // Initial check
    pollGamificationUpdates()

    return () => clearInterval(interval)
  }, [currentUser])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'xp_gain':
        return <TrendingUp sx={{ color: '#FFD700' }} />
      case 'level_up':
        return <Star sx={{ color: '#FF6B6B' }} />
      case 'voucher_earned':
        return <CardGiftcard sx={{ color: '#4CAF50' }} />
      case 'challenge_complete':
        return <CheckCircle sx={{ color: '#2196F3' }} />
      case 'challenge_participant':
        return <GroupAdd sx={{ color: '#9C27B0' }} />
      case 'challenge_liked':
        return <Favorite sx={{ color: '#FF69B4' }} />
      default:
        return <Star sx={{ color: '#9C27B0' }} />
    }
  }

  const formatNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'xp_gain':
        return `+${notification.xpGained} XP from ${notification.action}`
      case 'level_up':
        return `🎉 Level Up! You reached Level ${notification.newLevel}!`
      case 'voucher_earned':
        return `🎁 Congratulations! You earned a ${notification.discount}% voucher at Level ${notification.level}!`
      case 'challenge_complete':
        return `Challenge completed! +${notification.xpGained} XP`
      case 'challenge_participant':
        return `👤 ${notification.participantName || 'Someone'} joined your challenge!`
      case 'challenge_liked':
        return `❤️ ${notification.likerName || 'Someone'} liked your challenge!`
      default:
        return notification.message
    }
  }

  return (
    <Box>
      <Tooltip title="Gamification Notifications">
        <IconButton
          onClick={handleClick}
          sx={{
            color: '#32778E',
            position: 'relative',
            '&:hover': { bgcolor: 'rgba(50, 119, 142, 0.08)' }
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#FF6B6B',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          >
            <Star sx={{ fontSize: '1.8rem' }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled sx={{ justifyContent: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No gamification notifications
            </Typography>
          </MenuItem>
        ) : (
          <>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#063B71' }}>
                🎮 Gamification Updates
              </Typography>
            </Box>
            <Divider />
            {notifications.map((notification, index) => (
              <Box key={index}>
                <MenuItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'flex-start',
                    py: 1.5,
                    px: 2,
                    bgcolor: notification.type === 'level_up' ? 'rgba(255, 107, 107, 0.05)' :
                      notification.type === 'voucher_earned' ? 'rgba(76, 175, 80, 0.05)' :
                        notification.type === 'challenge_participant' ? 'rgba(156, 39, 176, 0.05)' :
                          notification.type === 'challenge_liked' ? 'rgba(255, 105, 180, 0.05)' :
                            'transparent',
                    '&:hover': {
                      bgcolor: notification.type === 'level_up' ? 'rgba(255, 107, 107, 0.1)' :
                        notification.type === 'voucher_earned' ? 'rgba(76, 175, 80, 0.1)' :
                          notification.type === 'challenge_participant' ? 'rgba(156, 39, 176, 0.1)' :
                            notification.type === 'challenge_liked' ? 'rgba(255, 105, 180, 0.1)' :
                              'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  {/* Notification Header with Icon and Type */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    {getNotificationIcon(notification.type)}
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ flex: 1, color: '#063B71' }}
                    >
                      {formatNotificationMessage(notification)}
                    </Typography>
                  </Box>

                  {/* Extra Details */}
                  {notification.type === 'level_up' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`Level ${notification.newLevel}`}
                        icon={<EmojiEvents />}
                        color="error"
                        variant="outlined"
                        size="small"
                      />
                      {notification.treeStageUpgrade && (
                        <Chip
                          label="🌳 Tree Upgraded!"
                          variant="outlined"
                          size="small"
                          sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
                        />
                      )}
                      {notification.landUnlock && (
                        <Chip
                          label={`${notification.landUnlock.newPlots} Plots Unlocked`}
                          variant="outlined"
                          size="small"
                          sx={{ borderColor: '#FFB74D', color: '#FFB74D' }}
                        />
                      )}
                    </Box>
                  )}

                  {notification.type === 'voucher_earned' && (
                    <Box sx={{ width: '100%', bgcolor: 'rgba(76, 175, 80, 0.1)', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                        Code: {notification.voucherCode}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: '#666' }}>
                        Valid until: {moment(notification.expiresAt).format('MMM DD, YYYY')}
                      </Typography>
                    </Box>
                  )}

                  {notification.type === 'xp_gain' && (
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Progress: {notification.currentXp} / {notification.nextLevelXp} XP
                    </Typography>
                  )}

                  {/* Timestamp */}
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '11px' }}
                  >
                    {moment(notification.timestamp).fromNow()}
                  </Typography>
                </MenuItem>
                {index !== notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </>
        )}
      </Menu>
    </Box>
  )
}

export default GamificationNotifications
