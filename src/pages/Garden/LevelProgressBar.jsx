import React from 'react'
import {
  Box,
  LinearProgress,
  Typography,
  Paper,
  Grid,
  Chip
} from '@mui/material'

const LevelProgressBar = ({ level = 1, currentXp = 0, nextLevelXp = 50, maxLevel = 10000 }) => {
  const progressPercent = Math.min((currentXp / nextLevelXp) * 100, 100)
  const progressToMaxLevel = Math.min((level / maxLevel) * 100, 100)

  // Get tree stage display name
  const getTreeStageInfo = () => {
    if (level >= 501) return { stage: 5, name: '🌳 Legendary Tree', color: '#FFD700' }
    if (level >= 201) return { stage: 4, name: '✨ Epic Tree', color: '#FF6B6B' }
    if (level >= 81) return { stage: 3, name: '🌲 Mature', color: '#4CAF50' }
    if (level >= 21) return { stage: 2, name: '🌱 Young Tree', color: '#7CB342' }
    return { stage: 1, name: '🌿 Sprout', color: '#9CCC65' }
  }

  const stageInfo = getTreeStageInfo()

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Level Display */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h6" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
              LEVEL
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
                {level}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                / {maxLevel}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Tree Stage Badge */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label={stageInfo.name}
              sx={{
                background: stageInfo.color,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                padding: '24px 8px',
                height: 'auto'
              }}
            />
          </Box>
        </Grid>

        {/* Overall Progress */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
              Overall Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressToMaxLevel}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4CAF50',
                  borderRadius: 4
                }
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 0.5, display: 'block' }}>
              {Math.floor(progressToMaxLevel)}% to max
            </Typography>
          </Box>
        </Grid>

        {/* Next Level Progress */}
        <Grid item xs={12}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                XP to next level
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                {currentXp} / {nextLevelXp}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FFD700',
                  borderRadius: 6,
                  background: 'linear-gradient(90deg, #FFD700 0%, #FFC107 100%)'
                }
              }}
            />
          </Box>
        </Grid>

        {/* Stage Description */}
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.85, fontStyle: 'italic' }}>
            {stageInfo.stage === 1 && '🌿 You are just starting your farm journey! Keep leveling up.'}
            {stageInfo.stage === 2 && '🌱 Your tree is growing! More plots will unlock soon.'}
            {stageInfo.stage === 3 && '🌲 Your farm is flourishing! You have unlocked many plots.'}
            {stageInfo.stage === 4 && '✨ Your tree is becoming legendary! Special effects activated.'}
            {stageInfo.stage === 5 && '🌳 You have reached legendary status! Maximum power unlocked!'}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default LevelProgressBar
