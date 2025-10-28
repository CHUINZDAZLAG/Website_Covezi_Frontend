import React from 'react'
import { Box } from '@mui/material'

const TreeIllustrationV4 = ({
  treeCustomization = {},
  level = 1,
  size = 200,
  treeStage = 1
}) => {
  const {
    treeType = 'rose',
    color = '#E91E63',
    potType = 'pot1',
    potColor = '#D7CCC8',
    effects = 'none'
  } = treeCustomization

  const scale = size / 200
  
  // Calculate tree size based on both level AND tree stage
  // Stage 1 (Sprout): tiny (20-30px), Stage 2 (Young): small (35-45px), Stage 3 (Mature): normal (40-50px)
  // Stage 4 (Epic): large (50-60px), Stage 5 (Legendary): full (60-80px)
  let baseTreeSize = 40
  if (treeStage === 1) baseTreeSize = 25  // Sprout - very small
  else if (treeStage === 2) baseTreeSize = 35  // Young - small
  else if (treeStage === 3) baseTreeSize = 45  // Mature - normal
  else if (treeStage === 4) baseTreeSize = 55  // Epic - large
  else if (treeStage === 5) baseTreeSize = 70  // Legendary - huge
  
  const treeSize = baseTreeSize + level * 0.5

  // ===== POT DESIGNS =====
  const renderPot = () => {
    const potStyle = {
      pot1: () => (
        <g key="pot1">
          <defs>
            <linearGradient id="pot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} stopOpacity="1" />
              <stop offset="100%" stopColor='rgba(0,0,0,0.2)' />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="170" rx="48" ry="8" fill="rgba(0,0,0,0.15)" />
          <path
            d="M 65 140 L 60 165 Q 60 172 68 175 L 132 175 Q 140 172 140 165 L 135 140 Z"
            fill="url(#pot-gradient)"
            stroke='rgba(0,0,0,0.15)'
            strokeWidth="1.5"
          />
          <path
            d="M 65 140 Q 100 135 135 140"
            fill="none"
            stroke='rgba(255,255,255,0.4)'
            strokeWidth="2"
          />
        </g>
      ),
      pot2: () => (
        <g key="pot2">
          <defs>
            <linearGradient id="ceramic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} stopOpacity="1" />
              <stop offset="50%" stopColor={potColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor='rgba(0,0,0,0.25)' />
            </linearGradient>
            <radialGradient id="ceramic-gloss" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="170" rx="45" ry="8" fill="rgba(0,0,0,0.2)" />
          <path
            d="M 68 145 L 64 167 Q 64 173 72 176 L 128 176 Q 136 173 136 167 L 132 145 Z"
            fill="url(#ceramic-gradient)"
            stroke='rgba(0,0,0,0.1)'
            strokeWidth="1"
          />
          <path
            d="M 68 145 Q 85 142 100 145 Q 115 142 132 145"
            fill="url(#ceramic-gloss)"
            opacity="0.5"
          />
          <path
            d="M 68 145 Q 100 140 132 145"
            fill="none"
            stroke='rgba(255,255,255,0.5)'
            strokeWidth="2.5"
          />
        </g>
      ),
      pot3: () => (
        <g key="pot3">
          <defs>
            <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} stopOpacity="0.7" />
              <stop offset="50%" stopColor={potColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor='rgba(0,0,0,0.15)' />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="170" rx="43" ry="7" fill="rgba(0,0,0,0.1)" />
          <path
            d="M 70 147 L 66 165 Q 66 171 74 174 L 126 174 Q 134 171 134 165 L 130 147 Z"
            fill="url(#glass-gradient)"
            stroke={potColor}
            strokeWidth="1.5"
          />
          <path
            d="M 72 149 Q 73 160 74 172"
            fill="none"
            stroke='rgba(255,255,255,0.6)'
            strokeWidth="3"
            opacity="0.8"
          />
          <path
            d="M 128 147 Q 127 160 126 172"
            fill="none"
            stroke='rgba(255,255,255,0.4)'
            strokeWidth="2"
            opacity="0.6"
          />
        </g>
      ),
      pot4: () => (
        <g key="pot4">
          <defs>
            <linearGradient id="hanging-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potColor} />
              <stop offset="100%" stopColor='rgba(0,0,0,0.2)' />
            </linearGradient>
          </defs>
          <line x1="95" y1="80" x2="88" y2="140" stroke="#A0826D" strokeWidth="2.5" />
          <line x1="105" y1="80" x2="112" y2="140" stroke="#A0826D" strokeWidth="2.5" />
          <circle cx="88" cy="140" r="3" fill="#8B7355" />
          <circle cx="112" cy="140" r="3" fill="#8B7355" />
          <ellipse cx="100" cy="168" rx="42" ry="7" fill="rgba(0,0,0,0.15)" />
          <path
            d="M 72 142 L 68 163 Q 68 170 76 173 L 124 173 Q 132 170 132 163 L 128 142 Z"
            fill="url(#hanging-gradient)"
            stroke='rgba(0,0,0,0.1)'
            strokeWidth="1"
          />
          <ellipse cx="100" cy="142" rx="28" ry="6" fill={potColor} stroke='rgba(0,0,0,0.1)' strokeWidth="1" />
        </g>
      )
    }

    return potStyle[potType]?.()
  }

  // ===== ENHANCED TREE DESIGNS (More Realistic) =====
  const renderTree = () => {
    const treeScale = Math.max(0.6, (treeSize / 40))
    const treeX = 100
    const treeY = 100 - treeScale * 10

    const trees = {
      // Rose - Classic romantic flower
      rose: () => (
        <g key="rose" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Stem with thorns */}
          <line x1="0" y1="0" x2="0" y2="35" stroke="#1B5E20" strokeWidth="2.5" />
          {/* Thorns */}
          {[8, 16, 24].map((y) => (
            <g key={`thorn-${y}`}>
              <line x1="0" y1={y} x2="-4" y2={y - 1.5} stroke="#1B5E20" strokeWidth="1.2" />
              <line x1="0" y1={y} x2="4" y2={y - 1.5} stroke="#1B5E20" strokeWidth="1.2" />
            </g>
          ))}
          {/* Leaves */}
          <ellipse cx="-7" cy="12" rx="4" ry="7" fill="#4CAF50" transform="rotate(-35 -7 12)" opacity="0.9" />
          <ellipse cx="7" cy="15" rx="4" ry="7" fill="#4CAF50" transform="rotate(35 7 15)" opacity="0.9" />
          {/* Rose bloom - realistic petals in spiral */}
          {/* Outer petals */}
          <circle cx="-9" cy="-5" r="5.5" fill={color} opacity="0.8" />
          <circle cx="9" cy="-5" r="5.5" fill={color} opacity="0.8" />
          <circle cx="-5" cy="-11" r="5" fill={color} opacity="0.8" />
          <circle cx="5" cy="-11" r="5" fill={color} opacity="0.8" />
          {/* Middle petals */}
          <circle cx="-6" cy="-3" r="4.5" fill={color} opacity="0.9" />
          <circle cx="6" cy="-3" r="4.5" fill={color} opacity="0.9" />
          <circle cx="0" cy="-8" r="4.5" fill={color} opacity="0.9" />
          {/* Inner petals */}
          <circle cx="-2" cy="-4" r="3.5" fill={color} opacity="1" />
          <circle cx="2" cy="-4" r="3.5" fill={color} opacity="1" />
          <circle cx="0" cy="-2" r="3" fill="#C41C3B" />
        </g>
      ),

      // Lavender - Delicate purple spikes
      lavender: () => (
        <g key="lavender" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Stem */}
          <line x1="0" y1="0" x2="0" y2="42" stroke="#558B2F" strokeWidth="2" />
          {/* Leaves at base */}
          <ellipse cx="-5" cy="28" rx="3" ry="9" fill="#7CB342" transform="rotate(-40 -5 28)" opacity="0.9" />
          <ellipse cx="5" cy="32" rx="3" ry="9" fill="#7CB342" transform="rotate(40 5 32)" opacity="0.9" />
          {/* Flower sections - stacked clusters */}
          {[0, 5, 10, 15, 20, 25, 32].map((offset, i) => (
            <g key={`cluster-${i}`}>
              <circle cx="-3" cy={-offset} r="2.5" fill={color} opacity="0.95" />
              <circle cx="3" cy={-offset} r="2.5" fill={color} opacity="0.95" />
              <circle cx="0" cy={-offset - 2.5} r="2.5" fill={color} opacity="1" />
            </g>
          ))}
        </g>
      ),

      // Banyan - Majestic spreading tree
      banyan: () => (
        <g key="banyan" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <radialGradient id="banyan-grad" cx="30%" cy="30%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor='rgba(0,0,0,0.2)' />
            </radialGradient>
          </defs>
          {/* Aerial roots - thick and natural */}
          {[-3, 0, 3].map((x) => (
            <g key={`root-${x}`}>
              <path
                d={`M ${x} 0 Q ${x - 5 - Math.random() * 3} 8 ${x - 8 - Math.random() * 2} 18`}
                stroke="#8D6E63"
                strokeWidth="2.5"
                fill="none"
                opacity="0.85"
              />
            </g>
          ))}
          {[-3, 0, 3].map((x) => (
            <g key={`root-right-${x}`}>
              <path
                d={`M ${x} 0 Q ${x + 5 + Math.random() * 3} 8 ${x + 8 + Math.random() * 2} 18`}
                stroke="#8D6E63"
                strokeWidth="2.5"
                fill="none"
                opacity="0.85"
              />
            </g>
          ))}
          {/* Main trunk */}
          <ellipse cx="0" cy="0" rx="5" ry="12" fill="#6D4C41" opacity="0.95" />
          {/* Large spreading canopy */}
          <ellipse cx="0" cy="-18" rx="24" ry="20" fill="url(#banyan-grad)" opacity="0.9" />
          <ellipse cx="-12" cy="-12" rx="16" ry="16" fill={color} opacity="0.82" />
          <ellipse cx="12" cy="-12" rx="16" ry="16" fill={color} opacity="0.82" />
          {/* Light spots for depth */}
          <circle cx="-8" cy="-18" r="3.5" fill='rgba(255,255,255,0.25)' opacity="0.8" />
          <circle cx="8" cy="-16" r="3" fill='rgba(255,255,255,0.2)' opacity="0.7" />
        </g>
      ),

      // Bamboo - Elegant segmented
      bamboo: () => (
        <g key="bamboo" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Segments with natural curve */}
          {[0, 8, 16, 24, 32].map((offset) => (
            <g key={`segment-${offset}`}>
              <rect x="-2.5" y={-offset} width="5" height="7.5" fill={color} stroke="#558B2F" strokeWidth="0.8" />
              {/* Joint rings */}
              <circle cx="-2.5" cy={-offset} r="1.2" fill="#33691E" />
              <circle cx="2.5" cy={-offset} r="1.2" fill="#33691E" />
            </g>
          ))}
          {/* Leaf clusters */}
          {[3, 14, 26].map((y) => (
            <g key={`leaves-${y}`} transform={`translate(0, ${-y})`}>
              <ellipse cx="-5" cy="0" rx="2.5" ry="6" fill="#7CB342" transform="rotate(-30 -5 0)" opacity="0.9" />
              <ellipse cx="5" cy="0" rx="2.5" ry="6" fill="#7CB342" transform="rotate(30 5 0)" opacity="0.9" />
              <ellipse cx="-2" cy="-3" rx="2" ry="5" fill="#9CCC65" opacity="0.8" />
              <ellipse cx="2" cy="-3" rx="2" ry="5" fill="#9CCC65" opacity="0.8" />
            </g>
          ))}
        </g>
      ),

      // Cactus - Rounded desert plant
      cactus: () => (
        <g key="cactus" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <radialGradient id="cactus-grad" cx="40%" cy="40%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="80%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor='rgba(0,0,0,0.2)' />
            </radialGradient>
          </defs>
          {/* Main body */}
          <ellipse cx="0" cy="0" rx="12" ry="18" fill="url(#cactus-grad)" stroke='rgba(0,0,0,0.1)' strokeWidth="1.5" />
          {/* Highlight */}
          <ellipse cx="-4" cy="-6" rx="6" ry="8" fill='rgba(255,255,255,0.12)' opacity="0.5" />
          {/* Realistic spines grouped naturally */}
          {[-16, -8, 0, 8, 16].map((y) => (
            <g key={`spine-left-${y}`}>
              <line x1="-12" y1={y} x2="-19" y2={y - 2} stroke="#C4A574" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
              <line x1="-12" y1={y + 1} x2="-18" y2={y} stroke="#D4B896" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </g>
          ))}
          {[-16, -8, 0, 8, 16].map((y) => (
            <g key={`spine-right-${y}`}>
              <line x1="12" y1={y} x2="19" y2={y - 2} stroke="#C4A574" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
              <line x1="12" y1={y + 1} x2="18" y2={y} stroke="#D4B896" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </g>
          ))}
          {/* Flowers at high levels */}
          {level >= 5 && (
            <>
              <circle cx="-9" cy="-20" r="5.5" fill="#FF1493" opacity="0.95" />
              <circle cx="9" cy="-20" r="5.5" fill="#FF1493" opacity="0.95" />
              <circle cx="0" cy="-24" r="5" fill="#FF1493" opacity="0.98" />
              {/* Flower centers */}
              <circle cx="-9" cy="-20" r="2.5" fill="#FFD700" opacity="0.8" />
              <circle cx="9" cy="-20" r="2.5" fill="#FFD700" opacity="0.8" />
              <circle cx="0" cy="-24" r="2" fill="#FFD700" opacity="0.8" />
            </>
          )}
          {/* More flowers at level 20+ */}
          {level >= 20 && (
            <>
              <circle cx="-15" cy="-10" r="4" fill="#FF69B4" opacity="0.9" />
              <circle cx="15" cy="-10" r="4" fill="#FF69B4" opacity="0.9" />
              <circle cx="-6" cy="-28" r="3.5" fill="#FF1493" opacity="0.85" />
              <circle cx="6" cy="-28" r="3.5" fill="#FF1493" opacity="0.85" />
              {/* Flower centers for new blooms */}
              <circle cx="-15" cy="-10" r="1.5" fill="#FFD700" opacity="0.7" />
              <circle cx="15" cy="-10" r="1.5" fill="#FFD700" opacity="0.7" />
              <circle cx="-6" cy="-28" r="1.2" fill="#FFD700" opacity="0.7" />
              <circle cx="6" cy="-28" r="1.2" fill="#FFD700" opacity="0.7" />
            </>
          )}
          {/* Even more flowers at level 50+ */}
          {level >= 50 && (
            <>
              <circle cx="-18" cy="-15" r="3.5" fill="#FF85C0" opacity="0.85" />
              <circle cx="18" cy="-15" r="3.5" fill="#FF85C0" opacity="0.85" />
              <circle cx="0" cy="-15" r="3" fill="#FF69B4" opacity="0.8" />
              <circle cx="-10" cy="-5" r="3.5" fill="#FF1493" opacity="0.8" />
              <circle cx="10" cy="-5" r="3.5" fill="#FF1493" opacity="0.8" />
              {/* Flower centers */}
              <circle cx="-18" cy="-15" r="1.3" fill="#FFD700" opacity="0.7" />
              <circle cx="18" cy="-15" r="1.3" fill="#FFD700" opacity="0.7" />
              <circle cx="0" cy="-15" r="1.2" fill="#FFD700" opacity="0.7" />
              <circle cx="-10" cy="-5" r="1.2" fill="#FFD700" opacity="0.7" />
              <circle cx="10" cy="-5" r="1.2" fill="#FFD700" opacity="0.7" />
            </>
          )}
          {/* Maximum flowers at level 100+ */}
          {level >= 100 && (
            <>
              <circle cx="-20" cy="-20" r="3" fill="#FF69B4" opacity="0.8" />
              <circle cx="20" cy="-20" r="3" fill="#FF69B4" opacity="0.8" />
              <circle cx="-14" cy="-25" r="2.8" fill="#FF1493" opacity="0.8" />
              <circle cx="14" cy="-25" r="2.8" fill="#FF1493" opacity="0.8" />
              <circle cx="-8" cy="-10" r="3" fill="#FF85C0" opacity="0.75" />
              <circle cx="8" cy="-10" r="3" fill="#FF85C0" opacity="0.75" />
              {/* Flower centers */}
              <circle cx="-20" cy="-20" r="1.2" fill="#FFD700" opacity="0.7" />
              <circle cx="20" cy="-20" r="1.2" fill="#FFD700" opacity="0.7" />
              <circle cx="-14" cy="-25" r="1.1" fill="#FFD700" opacity="0.7" />
              <circle cx="14" cy="-25" r="1.1" fill="#FFD700" opacity="0.7" />
              <circle cx="-8" cy="-10" r="1.1" fill="#FFD700" opacity="0.7" />
              <circle cx="8" cy="-10" r="1.1" fill="#FFD700" opacity="0.7" />
            </>
          )}
        </g>
      ),

      // Sunflower - Radiant golden flower
      sunflower: () => (
        <g key="sunflower" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7CB342" />
              <stop offset="50%" stopColor="#6D6D6D" />
              <stop offset="100%" stopColor="#558B2F" />
            </linearGradient>
            <radialGradient id="center-grad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#DAA520" stopOpacity="1" />
              <stop offset="100%" stopColor="#8B6914" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          {/* Strong stem */}
          <line x1="0" y1="12" x2="0" y2="38" stroke="url(#stem-grad)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Stem shine */}
          <line x1="-1.5" y1="12" x2="-1.5" y2="36" stroke='rgba(255,255,255,0.2)' strokeWidth="1.2" />
          {/* Leaves - organic shape */}
          <ellipse cx="-8" cy="20" rx="5" ry="11" fill="#7CB342" opacity="0.85" transform="rotate(-45 -8 20)" />
          <ellipse cx="-6.5" cy="22" rx="2.5" ry="7" fill='rgba(255,255,255,0.15)' transform="rotate(-45 -6.5 22)" />
          <ellipse cx="8" cy="23" rx="5" ry="11" fill="#7CB342" opacity="0.85" transform="rotate(45 8 23)" />
          <ellipse cx="6.5" cy="25" rx="2.5" ry="7" fill='rgba(255,255,255,0.15)' transform="rotate(45 6.5 25)" />
          {/* Back petal layer - 14 petals */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 360) / 14 + 12
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 11
            const y = Math.sin(rad) * 11
            return (
              <ellipse
                key={`petal-back-${i}`}
                cx={x}
                cy={y - 8}
                rx="3.5"
                ry="5.5"
                fill={color}
                opacity="0.65"
                transform={`rotate(${angle} ${x} ${y - 8})`}
              />
            )
          })}
          {/* Front petal layer - 14 petals */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 360) / 14
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 14
            const y = Math.sin(rad) * 14
            return (
              <ellipse
                key={`petal-front-${i}`}
                cx={x}
                cy={y - 8}
                rx="4.5"
                ry="8"
                fill={color}
                opacity="0.98"
                transform={`rotate(${angle} ${x} ${y - 8})`}
              />
            )
          })}
          {/* Center disk */}
          <circle cx="0" cy="-8" r="7.5" fill="url(#center-grad)" />
          {/* Center texture */}
          <circle cx="-2" cy="-9" r="1.5" fill="#FFD700" opacity="0.5" />
          <circle cx="2.5" cy="-7" r="1.2" fill="#FFD700" opacity="0.5" />
          <circle cx="0" cy="-10" r="1" fill="#FFD700" opacity="0.4" />
        </g>
      ),

      // Orchid - Exotic elegant flowers
      orchid: () => (
        <g key="orchid" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Curved stem */}
          <path d="M 0 22 Q 2.5 12 2 0 Q 1 -10 0 -26" stroke="#2E7D32" strokeWidth="2.2" fill="none" />
          {/* Leaves */}
          <ellipse cx="-6.5" cy="16" rx="3.5" ry="10" fill="#4CAF50" transform="rotate(-38 -6.5 16)" opacity="0.9" />
          <ellipse cx="6.5" cy="19" rx="3.5" ry="10" fill="#4CAF50" transform="rotate(38 6.5 19)" opacity="0.9" />
          {/* Orchid blooms - 3 layers */}
          {/* Bottom bloom */}
          <g transform="translate(0, 6)">
            <ellipse cx="-4" cy="0" rx="2.5" ry="3.5" fill={color} opacity="0.85" />
            <ellipse cx="4" cy="0" rx="2.5" ry="3.5" fill={color} opacity="0.85" />
            <circle cx="0" cy="0" r="3.5" fill={color} opacity="0.92" />
            <circle cx="0" cy="1.5" r="1.2" fill="#FFD700" opacity="0.9" />
          </g>
          {/* Middle bloom */}
          <g transform="translate(1.5, -8)">
            <ellipse cx="-4" cy="0" rx="2.5" ry="3.5" fill={color} opacity="0.88" />
            <ellipse cx="4" cy="0" rx="2.5" ry="3.5" fill={color} opacity="0.88" />
            <circle cx="0" cy="0" r="3.5" fill={color} opacity="0.95" />
            <circle cx="0" cy="1.5" r="1.2" fill="#FFD700" opacity="0.9" />
          </g>
          {/* Top bloom */}
          <g transform="translate(-1, -18)">
            <ellipse cx="-4" cy="0" rx="2.5" ry="3.5" fill={color} opacity="0.92" />
            <ellipse cx="4" cy="0" rx="2.5" ry="3.5" fill={color} opacity="0.92" />
            <circle cx="0" cy="0" r="3.5" fill={color} opacity="0.98" />
            <circle cx="0" cy="1.5" r="1.2" fill="#FFD700" opacity="0.9" />
          </g>
        </g>
      ),

      // Money Plant - Cascading vines
      moneyPlant: () => (
        <g key="moneyPlant" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Main vine curves */}
          <path d="M 0 0 Q -7 -4 -8 -12 Q -8 -18 -5 -24" stroke="#6D6D6D" strokeWidth="1.8" fill="none" opacity="0.8" />
          <path d="M 0 0 Q 7 -4 8 -12 Q 8 -18 5 -24" stroke="#6D6D6D" strokeWidth="1.8" fill="none" opacity="0.8" />
          <path d="M 0 0 Q -5 6 -7 14 Q -8 20 -4 26" stroke="#6D6D6D" strokeWidth="1.8" fill="none" opacity="0.8" />
          <path d="M 0 0 Q 5 6 7 14 Q 8 20 4 26" stroke="#6D6D6D" strokeWidth="1.8" fill="none" opacity="0.8" />
          {/* Heart-shaped leaves */}
          {[-8, 8, -7, 7, -4, 4].map((x, i) => {
            const y = Math.abs(x) > 6 ? -12 : (Math.abs(x) > 5 ? 14 : 0)
            return (
              <g key={`leaf-${i}`} transform={`translate(${x}, ${y})`}>
                <path
                  d="M -2 0 Q -3.5 -2 -2 -3 Q -0.5 -2 0 -2 Q 0.5 -2 2 -3 Q 3.5 -2 2 0 Q 0.5 2 0 2.5 Q -0.5 2 -2 0"
                  fill={color}
                  opacity="0.9"
                />
              </g>
            )
          })}
          {/* Center node */}
          <circle cx="0" cy="0" r="1.8" fill="#4CAF50" opacity="0.8" />
        </g>
      ),

      // Jade - Plump succulent
      jade: () => (
        <g key="jade" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          <defs>
            <radialGradient id="jade-grad" cx="35%" cy="35%">
              <stop offset="0%" stopColor='rgba(255,255,255,0.2)' />
              <stop offset="100%" stopColor='rgba(0,0,0,0.1)' />
            </radialGradient>
          </defs>
          {/* Main stem */}
          <line x1="0" y1="12" x2="0" y2="28" stroke="#8D6E63" strokeWidth="2.8" strokeLinecap="round" />
          {/* Upper left branch */}
          <g transform="translate(-7, 8)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#8D6E63" strokeWidth="1.8" />
            <ellipse cx="0" cy="2" rx="4.5" ry="6.5" fill={color} opacity="0.93" />
            <ellipse cx="0" cy="2" rx="4.5" ry="6.5" fill="url(#jade-grad)" />
            <ellipse cx="-3.5" cy="-0.5" rx="2.8" ry="4.5" fill={color} opacity="0.87" transform="rotate(-35 -3.5 -0.5)" />
            <ellipse cx="3.5" cy="-0.5" rx="2.8" ry="4.5" fill={color} opacity="0.87" transform="rotate(35 3.5 -0.5)" />
          </g>
          {/* Upper right branch */}
          <g transform="translate(7, 10)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#8D6E63" strokeWidth="1.8" />
            <ellipse cx="0" cy="2" rx="4.5" ry="6.5" fill={color} opacity="0.93" />
            <ellipse cx="0" cy="2" rx="4.5" ry="6.5" fill="url(#jade-grad)" />
            <ellipse cx="-3.5" cy="-0.5" rx="2.8" ry="4.5" fill={color} opacity="0.87" transform="rotate(-35 -3.5 -0.5)" />
            <ellipse cx="3.5" cy="-0.5" rx="2.8" ry="4.5" fill={color} opacity="0.87" transform="rotate(35 3.5 -0.5)" />
          </g>
          {/* Middle branches */}
          <g transform="translate(-5, 0)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#8D6E63" strokeWidth="1.5" />
            <ellipse cx="0" cy="1.5" rx="3.8" ry="5.5" fill={color} opacity="0.9" />
            <ellipse cx="0" cy="1.5" rx="3.8" ry="5.5" fill="url(#jade-grad)" />
          </g>
          <g transform="translate(5, 2)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#8D6E63" strokeWidth="1.5" />
            <ellipse cx="0" cy="1.5" rx="3.8" ry="5.5" fill={color} opacity="0.9" />
            <ellipse cx="0" cy="1.5" rx="3.8" ry="5.5" fill="url(#jade-grad)" />
          </g>
          {/* Top cluster */}
          <g transform="translate(0, -12)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#8D6E63" strokeWidth="1.8" />
            <ellipse cx="0" cy="1" rx="5" ry="7" fill={color} opacity="0.95" />
            <ellipse cx="0" cy="1" rx="5" ry="7" fill="url(#jade-grad)" />
            <ellipse cx="-3.5" cy="-1" rx="3.2" ry="5" fill={color} opacity="0.9" transform="rotate(-40 -3.5 -1)" />
            <ellipse cx="3.5" cy="-1" rx="3.2" ry="5" fill={color} opacity="0.9" transform="rotate(40 3.5 -1)" />
            <circle cx="-1.5" cy="0" r="1.8" fill='rgba(255,255,255,0.3)' opacity="0.6" />
          </g>
        </g>
      ),

      // Peony - Luxurious layered bloom
      peony: () => (
        <g key="peony" transform={`translate(${treeX}, ${treeY}) scale(${treeScale})`}>
          {/* Stem */}
          <line x1="0" y1="10" x2="0" y2="36" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx="-7" cy="18" rx="4.5" ry="8" fill="#4CAF50" transform="rotate(-38 -7 18)" opacity="0.9" />
          <ellipse cx="7" cy="21" rx="4.5" ry="8" fill="#4CAF50" transform="rotate(38 7 21)" opacity="0.9" />
          {/* Outer petals - 8 large */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 13
            const y = Math.sin(rad) * 13
            return (
              <ellipse
                key={`outer-${i}`}
                cx={x}
                cy={y - 5}
                rx="4.5"
                ry="7"
                fill={color}
                opacity="0.85"
                transform={`rotate(${angle} ${x} ${y - 5})`}
              />
            )
          })}
          {/* Inner petals - 6 medium */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 360) / 6 + 30
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 7.5
            const y = Math.sin(rad) * 7.5
            return (
              <circle
                key={`inner-${i}`}
                cx={x}
                cy={y - 5}
                r="3.5"
                fill={color}
                opacity="0.95"
              />
            )
          })}
          {/* Center */}
          <circle cx="0" cy="-5" r="3.5" fill="#FFD700" opacity="0.95" />
          <circle cx="-1.2" cy="-6" r="1" fill="#FFA500" opacity="0.7" />
          <circle cx="1.2" cy="-4" r="1" fill="#FFA500" opacity="0.7" />
        </g>
      )
    }

    return trees[treeType]?.()
  }

  // ===== EFFECTS =====
  const renderEffects = () => {
    // Auto-add effects based on tree stage if not already set
    let activeEffect = effects
    if (treeStage >= 4 && !effects) activeEffect = 'glow'      // Epic & Legendary = glow
    else if (treeStage === 5 && effects !== 'fog') activeEffect = 'sparkle' // Legendary = sparkle + glow
    
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
            <filter id="soft-glow-sparkle">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="glow-gradient-sparkle" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
            <filter id="spark-blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
          <circle cx="100" cy="100" r="60" fill="url(#glow-gradient-sparkle)" filter="url(#soft-glow-sparkle)" />
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
          <ellipse cx="80" cy="130" rx="50" ry="20" fill="rgba(200, 200, 220, 0.2)" filter="url(#fog-blur)" />
          <ellipse cx="120" cy="140" rx="55" ry="18" fill="rgba(200, 200, 220, 0.15)" filter="url(#fog-blur)" />
          <ellipse cx="100" cy="145" rx="60" ry="15" fill="rgba(200, 200, 220, 0.1)" filter="url(#fog-blur)" />
        </g>
      )
    }

    return effectStyles[activeEffect]
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
        {renderEffects()}
        {renderPot()}
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

export default TreeIllustrationV4
