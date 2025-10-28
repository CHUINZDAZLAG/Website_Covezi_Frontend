import React from 'react'
import { Box } from '@mui/material'

/**
 * TreeIllustration - 2D farm game style tree with growth stages
 * Displays tree at different growth levels with customizable colors
 */
const TreeIllustration = ({ level = 1, treeCustomization = {}, size = 200 }) => {
  // Tree customization
  const treePotType = treeCustomization?.potType || 'pot1'
  const treeColor = treeCustomization?.color || '#4CAF50'
  const potColor = treeCustomization?.potColor || '#8B7355'
  const effects = treeCustomization?.effects || 'none'

  // Determine growth stage based on level
  const getGrowthStage = () => {
    if (level <= 3) return 'seedling'
    if (level <= 6) return 'young'
    if (level <= 9) return 'mature'
    return 'blooming'
  }

  const stage = getGrowthStage()

  // Apply shadow effect
  const hasShadow = effects?.includes('glow') || effects?.includes('shine')

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Glow Effect (optional) */}
      {hasShadow && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: size * 0.6,
            height: size * 0.15,
            background: `radial-gradient(ellipse at center, ${treeColor}33 0%, transparent 70%)`,
            filter: 'blur(8px)',
            zIndex: 0,
          }}
        />
      )}

      {/* SVG Tree */}
      <svg
        viewBox="0 0 200 240"
        width={size}
        height={size * 1.2}
        style={{
          filter: hasShadow ? `drop-shadow(0 8px 12px ${treeColor}44)` : 'none',
          zIndex: 1,
        }}
      >
        {/* POT */}
        <g id="pot">
          {/* Pot body */}
          <path
            d="M 50 140 L 60 200 L 140 200 L 150 140 Z"
            fill={potColor}
            stroke="#6B5344"
            strokeWidth="2"
          />
          {/* Pot top rim */}
          <ellipse cx="100" cy="140" rx="50" ry="15" fill={potColor} stroke="#6B5344" strokeWidth="2" />
          {/* Pot shine */}
          <ellipse
            cx="75"
            cy="155"
            rx="12"
            ry="25"
            fill="white"
            opacity="0.2"
            filter="blur(2px)"
          />
          {/* Pot details */}
          <line x1="70" y1="160" x2="90" y2="190" stroke="#6B5344" strokeWidth="1" opacity="0.5" />
          <line x1="130" y1="160" x2="110" y2="190" stroke="#6B5344" strokeWidth="1" opacity="0.5" />
        </g>

        {/* SOIL */}
        <ellipse
          cx="100"
          cy="140"
          rx="48"
          ry="12"
          fill="#9D8B7E"
          opacity="0.6"
        />

        {/* TRUNK */}
        {stage !== 'seedling' && (
          <g id="trunk">
            <path
              d="M 95 140 Q 93 100 92 60 Q 91 40 95 20"
              stroke="#8B6F47"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Trunk shine */}
            <path
              d="M 95 140 Q 94 100 93.5 60 Q 92.5 40 95.5 20"
              stroke="#A0825A"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* FOLIAGE - SEEDLING STAGE (Level 1-3) */}
        {stage === 'seedling' && (
          <g id="seedling-foliage">
            {/* Single leaf bunch */}
            <ellipse cx="90" cy="110" rx="18" ry="28" fill={treeColor} opacity="0.8" />
            <ellipse cx="110" cy="110" rx="18" ry="28" fill={treeColor} opacity="0.8" />
            <ellipse cx="100" cy="85" rx="20" ry="30" fill={treeColor} />
            {/* Leaf shine */}
            <ellipse cx="92" cy="95" rx="8" ry="12" fill="white" opacity="0.25" />
          </g>
        )}

        {/* FOLIAGE - YOUNG STAGE (Level 4-6) */}
        {stage === 'young' && (
          <g id="young-foliage">
            {/* Main crown - round shape */}
            <circle cx="100" cy="70" r="35" fill={treeColor} />
            <circle cx="70" cy="85" r="28" fill={treeColor} opacity="0.9" />
            <circle cx="130" cy="85" r="28" fill={treeColor} opacity="0.9" />
            {/* Leaf shine highlights */}
            <circle cx="85" cy="65" r="10" fill="white" opacity="0.25" />
            <circle cx="115" cy="65" r="10" fill="white" opacity="0.25" />
          </g>
        )}

        {/* FOLIAGE - MATURE STAGE (Level 7-9) */}
        {stage === 'mature' && (
          <g id="mature-foliage">
            {/* Large full crown */}
            <circle cx="100" cy="60" r="42" fill={treeColor} />
            <circle cx="65" cy="80" r="32" fill={treeColor} opacity="0.9" />
            <circle cx="135" cy="80" r="32" fill={treeColor} opacity="0.9" />
            <circle cx="75" cy="115" r="28" fill={treeColor} opacity="0.85" />
            <circle cx="125" cy="115" r="28" fill={treeColor} opacity="0.85" />
            {/* Highlights */}
            <circle cx="85" cy="55" r="12" fill="white" opacity="0.3" />
            <circle cx="115" cy="55" r="12" fill="white" opacity="0.3" />
            <circle cx="70" cy="95" r="8" fill="white" opacity="0.2" />
          </g>
        )}

        {/* FOLIAGE - BLOOMING STAGE (Level 10+) */}
        {stage === 'blooming' && (
          <g id="blooming-foliage">
            {/* Extra large, dense crown */}
            <circle cx="100" cy="50" r="48" fill={treeColor} />
            <circle cx="60" cy="75" r="35" fill={treeColor} opacity="0.9" />
            <circle cx="140" cy="75" r="35" fill={treeColor} opacity="0.9" />
            <circle cx="70" cy="120" r="30" fill={treeColor} opacity="0.85" />
            <circle cx="130" cy="120" r="30" fill={treeColor} opacity="0.85" />
            <circle cx="100" cy="135" r="25" fill={treeColor} opacity="0.8" />
            {/* Premium highlights */}
            <circle cx="80" cy="50" r="14" fill="white" opacity="0.35" />
            <circle cx="120" cy="50" r="14" fill="white" opacity="0.35" />
            <circle cx="60" cy="90" r="10" fill="white" opacity="0.25" />
            {/* Flowers - only in blooming stage */}
            <circle cx="80" cy="35" r="6" fill="#FFB6C1" opacity="0.8" />
            <circle cx="120" cy="35" r="6" fill="#FFB6C1" opacity="0.8" />
            <circle cx="100" cy="25" r="7" fill="#FFB6C1" opacity="0.9" />
          </g>
        )}

        {/* LEVEL BADGE */}
        <g id="level-badge">
          <circle cx="160" cy="30" r="20" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          <text
            x="160"
            y="38"
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill="#333"
            fontFamily="Arial, sans-serif"
          >
            {level}
          </text>
        </g>
      </svg>

      {/* Growth Stage Label */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          fontWeight: 500,
          color: '#666',
          textTransform: 'capitalize',
          whiteSpace: 'nowrap',
        }}
      >
        {stage === 'seedling' && '🌱 Hạt giống'}
        {stage === 'young' && '🌿 Cây con'}
        {stage === 'mature' && '🌳 Cây lớn'}
        {stage === 'blooming' && '🌸 Cây nở hoa'}
      </Box>
    </Box>
  )
}

export default TreeIllustration
