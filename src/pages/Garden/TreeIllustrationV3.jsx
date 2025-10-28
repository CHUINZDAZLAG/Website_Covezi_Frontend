import React from 'react'
import { Box } from '@mui/material'

const TreeIllustrationV3 = ({
  treeCustomization = {},
  level = 1,
  size = 200
}) => {
  const {
    treeType = 'rose',
    color = '#E91E63',
    potType = 'pot1',
    potColor = '#D7CCC8',
    effects = 'none'
  } = treeCustomization

  const scale = size / 200
  const treeSize = 40 + level * 3

  // ===== POT DESIGNS (ENHANCED) =====
  const renderPot = () => {
    const potStyle = {
      pot1: () => (
        <g key="pot1">
          {/* Terracotta pot with texture and shadow */}
          <defs>
            <pattern id="terracotta-texture" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill={potColor} />
              <circle cx="1" cy="1" r="0.5" fill={`rgba(0,0,0,0.1)`} />
              <circle cx="3" cy="3" r="0.5" fill={`rgba(255,255,255,0.15)`} />
            </pattern>
            <linearGradient id="pot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} stopOpacity="1" />
              <stop offset="100%" stopColor={`rgba(0,0,0,0.2)`} />
            </linearGradient>
          </defs>
          {/* Pot shadow */}
          <ellipse cx="100" cy="170" rx="48" ry="8" fill="rgba(0,0,0,0.15)" />
          {/* Pot body */}
          <path
            d="M 65 140 L 60 165 Q 60 172 68 175 L 132 175 Q 140 172 140 165 L 135 140 Z"
            fill="url(#pot-gradient)"
            stroke={`rgba(0,0,0,0.15)`}
            strokeWidth="1.5"
          />
          {/* Pot rim highlight */}
          <path
            d="M 65 140 Q 100 135 135 140"
            fill="none"
            stroke={`rgba(255,255,255,0.4)`}
            strokeWidth="2"
          />
          {/* Pot texture details */}
          <circle cx="75" cy="155" r="1.5" fill={`rgba(0,0,0,0.1)`} />
          <circle cx="95" cy="158" r="1" fill={`rgba(0,0,0,0.08)`} />
          <circle cx="125" cy="160" r="1.2" fill={`rgba(0,0,0,0.1)`} />
        </g>
      ),
      pot2: () => (
        <g key="pot2">
          {/* Ceramic glossy pot */}
          <defs>
            <linearGradient id="ceramic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} stopOpacity="1" />
              <stop offset="50%" stopColor={potColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor={`rgba(0,0,0,0.25)`} />
            </linearGradient>
            <radialGradient id="ceramic-gloss" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          {/* Pot shadow */}
          <ellipse cx="100" cy="170" rx="45" ry="8" fill="rgba(0,0,0,0.2)" />
          {/* Pot body */}
          <path
            d="M 68 145 L 64 167 Q 64 173 72 176 L 128 176 Q 136 173 136 167 L 132 145 Z"
            fill="url(#ceramic-gradient)"
            stroke={`rgba(0,0,0,0.1)`}
            strokeWidth="1"
          />
          {/* Gloss reflection */}
          <path
            d="M 68 145 Q 85 142 100 145 Q 115 142 132 145"
            fill="url(#ceramic-gloss)"
            opacity="0.5"
          />
          {/* Rim highlight */}
          <path
            d="M 68 145 Q 100 140 132 145"
            fill="none"
            stroke={`rgba(255,255,255,0.5)`}
            strokeWidth="2.5"
          />
        </g>
      ),
      pot3: () => (
        <g key="pot3">
          {/* Glass transparent pot with shine */}
          <defs>
            <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} stopOpacity="0.7" />
              <stop offset="50%" stopColor={potColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={`rgba(0,0,0,0.15)`} />
            </linearGradient>
          </defs>
          {/* Pot shadow */}
          <ellipse cx="100" cy="170" rx="43" ry="7" fill="rgba(0,0,0,0.1)" />
          {/* Glass pot body */}
          <path
            d="M 70 147 L 66 165 Q 66 171 74 174 L 126 174 Q 134 171 134 165 L 130 147 Z"
            fill="url(#glass-gradient)"
            stroke={potColor}
            strokeWidth="1.5"
          />
          {/* Left shine line */}
          <path
            d="M 72 149 Q 73 160 74 172"
            fill="none"
            stroke={`rgba(255,255,255,0.6)`}
            strokeWidth="3"
            opacity="0.8"
          />
          {/* Right shine line */}
          <path
            d="M 128 147 Q 127 160 126 172"
            fill="none"
            stroke={`rgba(255,255,255,0.4)`}
            strokeWidth="2"
            opacity="0.6"
          />
        </g>
      ),
      pot4: () => (
        <g key="pot4">
          {/* Hanging pot with rope */}
          <defs>
            <linearGradient id="hanging-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} />
              <stop offset="100%" stopColor={`rgba(0,0,0,0.2)`} />
            </linearGradient>
          </defs>
          {/* Rope/cord */}
          <line x1="95" y1="80" x2="88" y2="140" stroke="#A0826D" strokeWidth="2.5" />
          <line x1="105" y1="80" x2="112" y2="140" stroke="#A0826D" strokeWidth="2.5" />
          {/* Rope knots */}
          <circle cx="88" cy="140" r="3" fill="#8B7355" />
          <circle cx="112" cy="140" r="3" fill="#8B7355" />
          {/* Pot shadow */}
          <ellipse cx="100" cy="168" rx="42" ry="7" fill="rgba(0,0,0,0.15)" />
          {/* Hanging pot body */}
          <path
            d="M 72 142 L 68 163 Q 68 170 76 173 L 124 173 Q 132 170 132 163 L 128 142 Z"
            fill="url(#hanging-gradient)"
            stroke={`rgba(0,0,0,0.1)`}
            strokeWidth="1"
          />
          {/* Pot rim */}
          <ellipse cx="100" cy="142" rx="28" ry="6" fill={potColor} stroke={`rgba(0,0,0,0.1)`} strokeWidth="1" />
        </g>
      )
    }

    return potStyle[potType]?.()
  }

  // ===== TREE DESIGNS (ENHANCED) =====
  const renderTree = () => {
    const treeScale = Math.max(0.6, (treeSize / 40))
    const treeX = 100
    const treeY = 100 - treeScale * 10

    const trees = {
      // Rose - Classic beauty with layered petals
      rose: () => (
        <g key="rose" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Stem with thorns */}
          <line x1="0" y1="0" x2="0" y2="35" stroke="#2E7D32" strokeWidth="2" />
          {/* Thorns left */}
          <line x1="0" y1="10" x2="-5" y2="8" stroke="#2E7D32" strokeWidth="1.2" />
          <line x1="0" y1="18" x2="-4" y2="16" stroke="#2E7D32" strokeWidth="1.2" />
          <line x1="0" y1="26" x2="-5" y2="24" stroke="#2E7D32" strokeWidth="1.2" />
          {/* Thorns right */}
          <line x1="0" y1="12" x2="5" y2="10" stroke="#2E7D32" strokeWidth="1.2" />
          <line x1="0" y1="20" x2="4" y2="18" stroke="#2E7D32" strokeWidth="1.2" />
          <line x1="0" y1="28" x2="5" y2="26" stroke="#2E7D32" strokeWidth="1.2" />
          {/* Leaves */}
          <ellipse cx="-8" cy="12" rx="4" ry="6" fill="#4CAF50" transform="rotate(-30 -8 12)" />
          <ellipse cx="8" cy="14" rx="4" ry="6" fill="#4CAF50" transform="rotate(30 8 14)" />
          <ellipse cx="-9" cy="24" rx="4" ry="6" fill="#4CAF50" transform="rotate(-25 -9 24)" />
          <ellipse cx="9" cy="26" rx="4" ry="6" fill="#4CAF50" transform="rotate(25 9 26)" />
          {/* Petals - outer layer (pink) */}
          <circle cx="-12" cy="-8" r="5" fill={color} opacity="0.9" />
          <circle cx="0" cy="-14" r="5" fill={color} opacity="0.9" />
          <circle cx="12" cy="-8" r="5" fill={color} opacity="0.9" />
          <circle cx="8" cy="0" r="5" fill={color} opacity="0.9" />
          <circle cx="-8" cy="0" r="5" fill={color} opacity="0.9" />
          {/* Petals - middle layer (darker) */}
          <circle cx="-8" cy="-6" r="4" fill={color} opacity="1" />
          <circle cx="0" cy="-10" r="4" fill={color} opacity="1" />
          <circle cx="8" cy="-6" r="4" fill={color} opacity="1" />
          <circle cx="5" cy="0" r="4" fill={color} opacity="1" />
          <circle cx="-5" cy="0" r="4" fill={color} opacity="1" />
          {/* Center (deep red) */}
          <circle cx="0" cy="-2" r="3" fill="#C41C3B" />
        </g>
      ),

      // Lavender - Delicate flower clusters
      lavender: () => (
        <g key="lavender" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Stem */}
          <line x1="0" y1="0" x2="0" y2="40" stroke="#6D6D6D" strokeWidth="1.5" />
          {/* Leaves at base */}
          <ellipse cx="-6" cy="30" rx="3" ry="8" fill="#7CB342" transform="rotate(-35 -6 30)" />
          <ellipse cx="6" cy="30" rx="3" ry="8" fill="#7CB342" transform="rotate(35 6 30)" />
          {/* Flower clusters - 7 sections from bottom to top */}
          {[0, 6, 12, 18, 24, 30, 36].map((offset, i) => (
            <g key={`cluster-${i}`}>
              <circle cx="-3" cy={-offset} r="2.5" fill={color} opacity="0.9" />
              <circle cx="3" cy={-offset} r="2.5" fill={color} opacity="0.9" />
              <circle cx="0" cy={-offset - 2} r="2.5" fill={color} opacity="1" />
            </g>
          ))}
        </g>
      ),

      // Banyan - Majestic tree with aerial roots
      banyan: () => (
        <g key="banyan" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <radialGradient id="banyan-gradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={`rgba(0,0,0,0.15)`} />
            </radialGradient>
          </defs>
          {/* Multiple aerial roots on left - more realistic */}
          <path d="M -3 0 Q -10 6 -14 18" stroke="#8D6E63" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M -2 1 Q -8 7 -11 20" stroke="#A1887F" strokeWidth="2.5" fill="none" opacity="0.8" />
          <path d="M -1 0.5 Q -6 6 -9 19" stroke="#8D6E63" strokeWidth="2" fill="none" opacity="0.7" />
          {/* Multiple aerial roots on right */}
          <path d="M 3 0 Q 10 6 14 18" stroke="#8D6E63" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 2 1 Q 8 7 11 20" stroke="#A1887F" strokeWidth="2.5" fill="none" opacity="0.8" />
          <path d="M 1 0.5 Q 6 6 9 19" stroke="#8D6E63" strokeWidth="2" fill="none" opacity="0.7" />
          {/* Main trunk with gradient */}
          <ellipse cx="0" cy="0" rx="5" ry="10" fill="#6D4C41" opacity="0.95" />
          <rect x="-3" y="0" width="6" height="8" fill={`rgba(255,255,255,0.1)`} />
          {/* Large layered canopy for depth */}
          <ellipse cx="0" cy="-20" rx="22" ry="18" fill={color} opacity="0.85" />
          <ellipse cx="-10" cy="-14" rx="16" ry="15" fill={color} opacity="0.88" />
          <ellipse cx="10" cy="-14" rx="16" ry="15" fill={color} opacity="0.88" />
          <ellipse cx="0" cy="-10" rx="18" ry="14" fill={color} opacity="0.92" />
          {/* Inner lighter canopy for dimension */}
          <ellipse cx="-5" cy="-18" rx="12" ry="10" fill={color} opacity="0.72" />
          <ellipse cx="5" cy="-18" rx="12" ry="10" fill={color} opacity="0.72" />
          {/* Light highlights */}
          <circle cx="-8" cy="-18" r="3" fill={`rgba(255,255,255,0.25)`} />
          <circle cx="8" cy="-16" r="2.5" fill={`rgba(255,255,255,0.2)`} />
          <circle cx="0" cy="-22" r="2" fill={`rgba(255,255,255,0.15)`} />
        </g>
      ),

      // Bamboo - Segmented elegant stem
      bamboo: () => (
        <g key="bamboo" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Main stem with segments */}
          {[0, 10, 20, 30].map((offset) => (
            <g key={`segment-${offset}`}>
              <rect x="-2" y={-offset} width="4" height="8" fill={color} stroke="#558B2F" strokeWidth="0.5" />
              {/* Joint line */}
              <line x1="-2" y1={-offset} x2="2" y2={-offset} stroke="#33691E" strokeWidth="1" />
            </g>
          ))}
          {/* Leaves cluster 1 */}
          <g transform="translate(0, -5)">
            <ellipse cx="-5" cy="-2" rx="2" ry="6" fill="#7CB342" transform="rotate(-30 -5 -2)" />
            <ellipse cx="5" cy="-2" rx="2" ry="6" fill="#7CB342" transform="rotate(30 5 -2)" />
            <ellipse cx="-3" cy="-5" rx="2" ry="5" fill="#9CCC65" />
            <ellipse cx="3" cy="-5" rx="2" ry="5" fill="#9CCC65" />
          </g>
          {/* Leaves cluster 2 */}
          <g transform="translate(0, -15)">
            <ellipse cx="-5" cy="-2" rx="2" ry="6" fill="#7CB342" transform="rotate(-25 -5 -2)" />
            <ellipse cx="5" cy="-2" rx="2" ry="6" fill="#7CB342" transform="rotate(25 5 -2)" />
            <ellipse cx="-3" cy="-5" rx="2" ry="5" fill="#9CCC65" />
            <ellipse cx="3" cy="-5" rx="2" ry="5" fill="#9CCC65" />
          </g>
          {/* Leaves cluster 3 */}
          <g transform="translate(0, -27)">
            <ellipse cx="-5" cy="-2" rx="2" ry="6" fill="#7CB342" transform="rotate(-30 -5 -2)" />
            <ellipse cx="5" cy="-2" rx="2" ry="6" fill="#7CB342" transform="rotate(30 5 -2)" />
          </g>
        </g>
      ),

      // Cactus - Rounded with spines
      cactus: () => (
        <g key="cactus" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <radialGradient id="cactus-gradient" cx="40%" cy="40%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="70%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor='rgba(0,0,0,0.2)' />
            </radialGradient>
          </defs>
          {/* Main body with gradient */}
          <ellipse cx="0" cy="0" rx="11" ry="16" fill="url(#cactus-gradient)" stroke='rgba(0,0,0,0.08)' strokeWidth="1.5" />
          {/* Body highlight */}
          <ellipse cx="-3" cy="-6" rx="5" ry="7" fill='rgba(255,255,255,0.15)' opacity="0.6" />
          {/* Dense spines - grouped by sections */}
          {/* Left side spines */}
          {[-14, -7, 0, 7, 14].map((y) => (
            <g key={`spine-left-${y}`}>
              <line x1="-11" y1={y} x2="-17" y2={y - 2} stroke="#D4A574" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="-11" y1={y} x2="-16" y2={y + 1} stroke="#E8D4B8" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
          {/* Right side spines */}
          {[-14, -7, 0, 7, 14].map((y) => (
            <g key={`spine-right-${y}`}>
              <line x1="11" y1={y} x2="17" y2={y - 2} stroke="#D4A574" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="11" y1={y} x2="16" y2={y + 1} stroke="#E8D4B8" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
          {/* Top spines */}
          {[-8, 0, 8].map((x) => (
            <g key={`spine-top-${x}`}>
              <line x1={x} y1="-16" x2={x - 2} y2="-23" stroke="#D4A574" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={x} y1="-16" x2={x + 2} y2="-22" stroke="#E8D4B8" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
          {/* Flowers at top (appears at level 5+) - enhanced */}
          {level >= 5 && (
            <>
              {/* Left flower */}
              <circle cx="-8" cy="-20" r="5" fill="#FF1493" opacity="0.95" />
              <circle cx="-9" cy="-21" r="2.5" fill="#FFB6C1" opacity="0.8" />
              <circle cx="-7" cy="-19" r="1.5" fill="#FFD700" opacity="0.9" />
              {/* Right flower */}
              <circle cx="8" cy="-20" r="5" fill="#FF1493" opacity="0.95" />
              <circle cx="9" cy="-21" r="2.5" fill="#FFB6C1" opacity="0.8" />
              <circle cx="7" cy="-19" r="1.5" fill="#FFD700" opacity="0.9" />
              {/* Top flower */}
              <circle cx="0" cy="-23" r="5" fill="#FF1493" opacity="0.95" />
              <circle cx="0" cy="-24" r="2.5" fill="#FFB6C1" opacity="0.8" />
              <circle cx="0" cy="-22" r="1.5" fill="#FFD700" opacity="0.9" />
            </>
          )}
        </g>
      ),

      // Sunflower - Large bright petals
      sunflower: () => (
        <g key="sunflower" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <linearGradient id="stem-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7CB342" />
              <stop offset="50%" stopColor="#6D6D6D" />
              <stop offset="100%" stopColor="#558B2F" />
            </linearGradient>
            <radialGradient id="center-gradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8B5A00" stopOpacity="1" />
              <stop offset="100%" stopColor="#663300" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          {/* Stem with gradient */}
          <line x1="0" y1="10" x2="0" y2="35" stroke="url(#stem-gradient)" strokeWidth="3" strokeLinecap="round" />
          {/* Stem shine */}
          <line x1="-1.5" y1="10" x2="-1.5" y2="32" stroke='rgba(255,255,255,0.2)' strokeWidth="1" />
          {/* Leaves - more detailed */}
          <g>
            <ellipse cx="-7" cy="18" rx="4" ry="9" fill="#7CB342" opacity="0.85" transform="rotate(-40 -7 18)" />
            <ellipse cx="-6" cy="20" rx="2" ry="6" fill='rgba(255,255,255,0.15)' transform="rotate(-40 -6 20)" />
          </g>
          <g>
            <ellipse cx="7" cy="21" rx="4" ry="9" fill="#7CB342" opacity="0.85" transform="rotate(40 7 21)" />
            <ellipse cx="6" cy="23" rx="2" ry="6" fill='rgba(255,255,255,0.15)' transform="rotate(40 6 23)" />
          </g>
          {/* Back petals layer (lighter) - 12 petals */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12 + 15
            const x = Math.cos((angle * Math.PI) / 180) * 12
            const y = Math.sin((angle * Math.PI) / 180) * 12
            return (
              <ellipse
                key={`petal-back-${i}`}
                cx={x}
                cy={y - 8}
                rx="3.5"
                ry="6"
                fill={color}
                opacity="0.6"
                transform={`rotate(${angle} ${x} ${y - 8})`}
              />
            )
          })}
          {/* Front petals layer (darker) - 12 petals */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12
            const x = Math.cos((angle * Math.PI) / 180) * 14
            const y = Math.sin((angle * Math.PI) / 180) * 14
            return (
              <ellipse
                key={`petal-front-${i}`}
                cx={x}
                cy={y - 8}
                rx="4.2"
                ry="7.5"
                fill={color}
                opacity="0.98"
                transform={`rotate(${angle} ${x} ${y - 8})`}
              />
            )
          })}
          {/* Disk center with gradient */}
          <circle cx="0" cy="-8" r="7" fill="url(#center-gradient)" />
          {/* Center texture details */}
          <circle cx="-2.5" cy="-9" r="1.2" fill="#FFD700" opacity="0.6" />
          <circle cx="2.5" cy="-7" r="1.2" fill="#FFD700" opacity="0.6" />
          <circle cx="0" cy="-10" r="0.8" fill="#FFD700" opacity="0.5" />
          <circle cx="-1" cy="-6" r="0.8" fill="#FFA500" opacity="0.4" />
        </g>
      ),

      // Orchid - Exotic flowers
      orchid: () => (
        <g key="orchid" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Curved stem */}
          <path d="M 0 20 Q 3 10 2 -5 Q 1 -15 0 -25" stroke="#2E7D32" strokeWidth="2" fill="none" />
          {/* Leaves */}
          <ellipse cx="-6" cy="15" rx="3" ry="9" fill="#4CAF50" transform="rotate(-35 -6 15)" />
          <ellipse cx="6" cy="18" rx="3" ry="9" fill="#4CAF50" transform="rotate(35 6 18)" />
          {/* Orchid bloom 1 - bottom */}
          <g transform="translate(0, 5)">
            <circle cx="0" cy="0" r="4" fill={color} opacity="0.9" />
            <ellipse cx="-4" cy="1" rx="2" ry="3" fill={color} />
            <ellipse cx="4" cy="1" rx="2" ry="3" fill={color} />
            <circle cx="0" cy="2" r="1.5" fill="#FFD700" />
          </g>
          {/* Orchid bloom 2 - middle */}
          <g transform="translate(2, -8)">
            <circle cx="0" cy="0" r="4" fill={color} opacity="0.85" />
            <ellipse cx="-4" cy="1" rx="2" ry="3" fill={color} />
            <ellipse cx="4" cy="1" rx="2" ry="3" fill={color} />
            <circle cx="0" cy="2" r="1.5" fill="#FFD700" />
          </g>
          {/* Orchid bloom 3 - top */}
          <g transform="translate(-1, -18)">
            <circle cx="0" cy="0" r="4" fill={color} opacity="0.8" />
            <ellipse cx="-4" cy="1" rx="2" ry="3" fill={color} />
            <ellipse cx="4" cy="1" rx="2" ry="3" fill={color} />
            <circle cx="0" cy="2" r="1.5" fill="#FFD700" />
          </g>
        </g>
      ),

      // Money Plant - Vining with heart leaves
      moneyPlant: () => (
        <g key="moneyPlant" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Winding vines */}
          <path d="M 0 0 Q -8 -6 -6 -14 Q -4 -20 -8 -26" stroke="#6D6D6D" strokeWidth="1.5" fill="none" />
          <path d="M 0 0 Q 8 -6 6 -14 Q 4 -20 8 -26" stroke="#6D6D6D" strokeWidth="1.5" fill="none" />
          <path d="M 0 0 Q -5 8 -8 16 Q -10 22 -6 28" stroke="#6D6D6D" strokeWidth="1.5" fill="none" />
          <path d="M 0 0 Q 5 8 8 16 Q 10 22 6 28" stroke="#6D6D6D" strokeWidth="1.5" fill="none" />
          {/* Heart-shaped leaves */}
          <g transform="translate(-8, -12)">
            <path d="M -2 0 Q -3 -2 -2 -3 Q -1 -2 0 -2 Q 1 -2 2 -3 Q 3 -2 2 0 Q 0 2 0 3 Q -2 2 -2 0" fill={color} />
          </g>
          <g transform="translate(8, -12)">
            <path d="M -2 0 Q -3 -2 -2 -3 Q -1 -2 0 -2 Q 1 -2 2 -3 Q 3 -2 2 0 Q 0 2 0 3 Q -2 2 -2 0" fill={color} />
          </g>
          <g transform="translate(-8, 16)">
            <path d="M -2 0 Q -3 -2 -2 -3 Q -1 -2 0 -2 Q 1 -2 2 -3 Q 3 -2 2 0 Q 0 2 0 3 Q -2 2 -2 0" fill={color} />
          </g>
          <g transform="translate(8, 16)">
            <path d="M -2 0 Q -3 -2 -2 -3 Q -1 -2 0 -2 Q 1 -2 2 -3 Q 3 -2 2 0 Q 0 2 0 3 Q -2 2 -2 0" fill={color} />
          </g>
          {/* Center root */}
          <circle cx="0" cy="0" r="1.5" fill="#4CAF50" />
        </g>
      ),

      // Jade - Succulent with fleshy leaves
      jade: () => (
        <g key="jade" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <radialGradient id="jade-leaf-gradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor='rgba(255,255,255,0.2)' />
              <stop offset="100%" stopColor='rgba(0,0,0,0.1)' />
            </radialGradient>
          </defs>
          {/* Main stem - woody appearance */}
          <line x1="0" y1="10" x2="0" y2="28" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-1" y1="10" x2="-1" y2="26" stroke='rgba(255,255,255,0.15)' strokeWidth="1" />
          
          {/* Lower left branch with leaves */}
          <g transform="translate(-7, 8)">
            {/* Branch stem */}
            <line x1="0" y1="0" x2="0" y2="6" stroke="#8D6E63" strokeWidth="1.5" />
            {/* Main leaf */}
            <ellipse cx="0" cy="2" rx="4" ry="6" fill={color} opacity="0.92" />
            <ellipse cx="0" cy="2" rx="4" ry="6" fill="url(#jade-leaf-gradient)" />
            {/* Side leaf left */}
            <ellipse cx="-3" cy="0" rx="2.5" ry="4" fill={color} opacity="0.85" transform="rotate(-35 -3 0)" />
            {/* Side leaf right */}
            <ellipse cx="3" cy="0" rx="2.5" ry="4" fill={color} opacity="0.85" transform="rotate(35 3 0)" />
          </g>
          
          {/* Lower right branch with leaves */}
          <g transform="translate(7, 8)">
            {/* Branch stem */}
            <line x1="0" y1="0" x2="0" y2="6" stroke="#8D6E63" strokeWidth="1.5" />
            {/* Main leaf */}
            <ellipse cx="0" cy="2" rx="4" ry="6" fill={color} opacity="0.92" />
            <ellipse cx="0" cy="2" rx="4" ry="6" fill="url(#jade-leaf-gradient)" />
            {/* Side leaves */}
            <ellipse cx="-3" cy="0" rx="2.5" ry="4" fill={color} opacity="0.85" transform="rotate(-35 -3 0)" />
            <ellipse cx="3" cy="0" rx="2.5" ry="4" fill={color} opacity="0.85" transform="rotate(35 3 0)" />
          </g>
          
          {/* Middle left branch */}
          <g transform="translate(-5, -2)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#8D6E63" strokeWidth="1.2" />
            <ellipse cx="0" cy="1.5" rx="3.5" ry="5" fill={color} opacity="0.88" />
            <ellipse cx="0" cy="1.5" rx="3.5" ry="5" fill="url(#jade-leaf-gradient)" />
            <ellipse cx="-2.5" cy="0" rx="2" ry="3.5" fill={color} opacity="0.82" transform="rotate(-30 -2.5 0)" />
          </g>
          
          {/* Middle right branch */}
          <g transform="translate(5, -2)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#8D6E63" strokeWidth="1.2" />
            <ellipse cx="0" cy="1.5" rx="3.5" ry="5" fill={color} opacity="0.88" />
            <ellipse cx="0" cy="1.5" rx="3.5" ry="5" fill="url(#jade-leaf-gradient)" />
            <ellipse cx="2.5" cy="0" rx="2" ry="3.5" fill={color} opacity="0.82" transform="rotate(30 2.5 0)" />
          </g>
          
          {/* Top center cluster */}
          <g transform="translate(0, -10)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#8D6E63" strokeWidth="1.5" />
            {/* Center main leaf */}
            <ellipse cx="0" cy="1" rx="4.5" ry="6" fill={color} opacity="0.95" />
            <ellipse cx="0" cy="1" rx="4.5" ry="6" fill="url(#jade-leaf-gradient)" />
            {/* Left leaf */}
            <ellipse cx="-3" cy="-1" rx="3" ry="4.5" fill={color} opacity="0.88" transform="rotate(-40 -3 -1)" />
            {/* Right leaf */}
            <ellipse cx="3" cy="-1" rx="3" ry="4.5" fill={color} opacity="0.88" transform="rotate(40 3 -1)" />
            {/* Back leaf */}
            <ellipse cx="0" cy="-2" rx="2.5" ry="4" fill={color} opacity="0.78" transform="rotate(0 0 -2)" />
            {/* Highlight on top */}
            <circle cx="-1" cy="-1" r="1.5" fill='rgba(255,255,255,0.25)' opacity="0.7" />
          </g>
        </g>
      ),

      // Peony - Full blooming flower
      peony: () => (
        <g key="peony" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Stem */}
          <line x1="0" y1="8" x2="0" y2="35" stroke="#2E7D32" strokeWidth="2" />
          {/* Leaves */}
          <ellipse cx="-6" cy="18" rx="4" ry="7" fill="#4CAF50" transform="rotate(-35 -6 18)" />
          <ellipse cx="6" cy="20" rx="4" ry="7" fill="#4CAF50" transform="rotate(35 6 20)" />
          {/* Outer petals (8 large petals) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            const x = Math.cos((angle * Math.PI) / 180) * 12
            const y = Math.sin((angle * Math.PI) / 180) * 12
            return (
              <ellipse
                key={`outer-petal-${i}`}
                cx={x}
                cy={y - 5}
                rx="4"
                ry="6"
                fill={color}
                opacity="0.85"
                transform={`rotate(${angle} ${x} ${y - 5})`}
              />
            )
          })}
          {/* Inner petals (5 petals) */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i * 360) / 5 + 36
            const x = Math.cos((angle * Math.PI) / 180) * 6
            const y = Math.sin((angle * Math.PI) / 180) * 6
            return (
              <circle
                key={`inner-petal-${i}`}
                cx={x}
                cy={y - 5}
                r="3"
                fill={color}
                opacity="0.95"
              />
            )
          })}
          {/* Golden center */}
          <circle cx="0" cy="-5" r="3" fill="#FFD700" />
          <circle cx="-1" cy="-5.5" r="0.8" fill="#FFA500" />
          <circle cx="1" cy="-4.5" r="0.8" fill="#FFA500" />
        </g>
      )
    }

    return trees[treeType]?.()
  }

  // ===== EFFECTS (ENHANCED) =====
  const renderEffects = () => {
    const effectStyles = {
      none: null,
      glow: (
        <g key="glow-effect">
          <defs>
            <filter id="soft-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="60" fill="url(#glow-gradient)" filter="url(#soft-glow)" />
        </g>
      ),
      sparkle: (
        <g key="sparkle-effect">
          <defs>
            <filter id="spark-blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
          {/* Animated sparkles around tree */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            const x = 100 + Math.cos((angle * Math.PI) / 180) * 70
            const y = 100 + Math.sin((angle * Math.PI) / 180) * 70
            return (
              <g key={`sparkle-${i}`}>
                <polygon
                  points={`${x},${y - 3} ${x + 2},${y} ${x},${y + 3} ${x - 2},${y}`}
                  fill="#FFD700"
                  opacity="0.9"
                  filter="url(#spark-blur)"
                />
              </g>
            )
          })}
        </g>
      ),
      fog: (
        <g key="fog-effect">
          <defs>
            <filter id="fog-blur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          {/* Mist layers */}
          <ellipse cx="80" cy="130" rx="50" ry="20" fill="rgba(200, 200, 220, 0.2)" filter="url(#fog-blur)" />
          <ellipse cx="120" cy="140" rx="55" ry="18" fill="rgba(200, 200, 220, 0.15)" filter="url(#fog-blur)" />
          <ellipse cx="100" cy="145" rx="60" ry="15" fill="rgba(200, 200, 220, 0.1)" filter="url(#fog-blur)" />
        </g>
      )
    }

    return effectStyles[effects]
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{ filter: effects === 'sparkle' ? 'drop-shadow(0 0 8px rgba(255,215,0,0.3))' : 'none' }}
      >
        {/* Background glow for certain effects */}
        {effects === 'glow' && (
          <defs>
            <filter id="background-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}

        {/* Effects background */}
        {renderEffects()}

        {/* Pot */}
        {renderPot()}

        {/* Tree */}
        {renderTree()}

        {/* Level badge */}
        <g>
          <circle cx="170" cy="30" r="16" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          <text
            x="170"
            y="37"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#FF8C00"
          >
            {level}
          </text>
        </g>
      </svg>
    </Box>
  )
}

export default TreeIllustrationV3
