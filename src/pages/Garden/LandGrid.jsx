import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tooltip
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const LandGrid = ({ landUnlocked = 1, landTheme = 'starter', level = 1 }) => {
  // Max possible plots to show in grid
  const maxPlots = 30
  const displayedPlots = Math.min(maxPlots, Math.max(landUnlocked + 5, 10))

  // Land theme information
  const themeInfo = {
    starter: {
      name: 'Starter Farm',
      color: '#90A4AE',
      icon: '🌍',
      description: 'Your first plot'
    },
    explorer: {
      name: 'Explorer',
      color: '#7CB342',
      icon: '🌱',
      description: '2 plots unlocked'
    },
    farmer: {
      name: 'Farmer',
      color: '#558B2F',
      icon: '🌾',
      description: '5 plots - farm level'
    },
    master: {
      name: 'Master Farmer',
      color: '#33691E',
      icon: '🌳',
      description: '10 plots - full farm'
    },
    premium: {
      name: 'Premium Farm',
      color: '#1565C0',
      icon: '💎',
      description: '15 plots + special zones'
    },
    legendary: {
      name: 'Legendary Farm',
      color: '#F57F17',
      icon: '👑',
      description: '20 plots + village theme'
    },
    mythical: {
      name: 'Mythical Farm',
      color: '#D32F2F',
      icon: '🌟',
      description: '30 plots + legendary effects'
    }
  }

  const currentTheme = themeInfo[landTheme] || themeInfo.starter

  // Get next unlock level
  const unlockThresholds = [
    { level: 1, plots: 1, theme: 'starter' },
    { level: 20, plots: 2, theme: 'explorer' },
    { level: 80, plots: 5, theme: 'farmer' },
    { level: 150, plots: 10, theme: 'master' },
    { level: 300, plots: 15, theme: 'premium' },
    { level: 500, plots: 20, theme: 'legendary' },
    { level: 2000, plots: 30, theme: 'mythical' }
  ]

  const nextUnlock = unlockThresholds.find(t => t.level > level)

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${currentTheme.color} 0%, ${currentTheme.color}dd 100%)`,
        color: 'white'
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          {currentTheme.icon} {currentTheme.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {currentTheme.description}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
          📊 Plots Unlocked: {landUnlocked}/{Math.max(landUnlocked, displayedPlots)}
        </Typography>

        {nextUnlock && (
          <Tooltip title={`Reach level ${nextUnlock.level} to unlock ${nextUnlock.plots} plots`}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                p: 1,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                cursor: 'help'
              }}
            >
              🎯 Next: Lv{nextUnlock.level} → {nextUnlock.plots} plots ({themeInfo[nextUnlock.theme].name})
            </Typography>
          </Tooltip>
        )}
      </Box>

      {/* Land Grid */}
      <Grid container spacing={1.5}>
        {Array.from({ length: displayedPlots }).map((_, index) => {
          const isUnlocked = index < landUnlocked
          const thresholdIndex = unlockThresholds.findIndex(t => index < t.plots)
          const unlockLevel = thresholdIndex >= 0 ? unlockThresholds[thresholdIndex].level : 9999

          return (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Tooltip
                title={
                  isUnlocked
                    ? `Plot ${index + 1} - Unlocked ✓`
                    : `Plot ${index + 1} - Unlock at Level ${unlockLevel}`
                }
              >
                <Box
                  sx={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    background: isUnlocked
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.7) 0%, rgba(56, 142, 60, 0.7) 100%)'
                      : 'rgba(255,255,255,0.1)',
                    border: isUnlocked
                      ? '2px solid rgba(255,255,255,0.5)'
                      : '2px dashed rgba(255,255,255,0.3)',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isUnlocked ? 'scale(1.05)' : 'scale(0.98)',
                      background: isUnlocked
                        ? 'linear-gradient(135deg, rgba(100, 180, 100, 0.8) 0%, rgba(80, 155, 80, 0.8) 100%)'
                        : 'rgba(255,255,255,0.15)',
                      boxShadow: isUnlocked ? '0 0 12px rgba(76,175,80,0.5)' : 'none'
                    }
                  }}
                >
                  {isUnlocked ? (
                    <CheckCircleIcon sx={{ fontSize: '1.8rem' }} />
                  ) : (
                    <LockIcon sx={{ fontSize: '1.5rem', opacity: 0.5 }} />
                  )}
                </Box>
              </Tooltip>
            </Grid>
          )
        })}
      </Grid>

      {/* Progress Info */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
          💡 Tip: Gain XP through challenges and daily login to unlock more plots and expand your farm!
        </Typography>
      </Box>
    </Paper>
  )
}

export default LandGrid
