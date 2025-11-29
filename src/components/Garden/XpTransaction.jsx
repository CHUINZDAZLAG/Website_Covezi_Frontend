import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { keyframes } from '@emotion/react'

// Animation for XP popup floating up
const floatUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0.8);
  }
`

const XpPopupContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 10,
  animation: `${floatUp} 1.5s ease-out forwards`
}))

function XpTransaction({ xp, x, y, action }) {
  return (
    <XpPopupContainer
      sx={{
        left: `${x}px`,
        top: `${y}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          color: '#FFD700',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          fontSize: '18px',
          whiteSpace: 'nowrap'
        }}
      >
        +{xp} XP
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: '#FFB700',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          fontSize: '12px',
          opacity: 0.8
        }}
      >
        {action}
      </Typography>
    </XpPopupContainer>
  )
}

export default XpTransaction
