import { Box } from '@mui/material'

const TreeIllustrationV2 = ({ level = 1, treeCustomization = {}, size = 200 }) => {
  const {
    treeType = 'rose',
    color = '#4CAF50',
    potType = 'pot1',
    potColor = '#D7CCC8',
    effects = 'none',
    name = 'Cây của tôi'
  } = treeCustomization

  // Determine tree size based on level
  const treeSize = Math.min(size * 0.6, 40 + level * 3)
  const potHeight = size * 0.25

  // Tree rendering functions for each type
  const trees = {
    rose: (
      <>
        {/* Stem */}
        <line x1={size / 2} y1={size * 0.4} x2={size / 2} y2={size * 0.7} stroke="#228B22" strokeWidth="3" />
        {/* Thorns */}
        <line x1={size / 2 - 8} y1={size * 0.5} x2={size / 2 - 12} y2={size * 0.48} stroke="#2d5016" strokeWidth="1.5" />
        <line x1={size / 2 + 8} y1={size * 0.55} x2={size / 2 + 12} y2={size * 0.57} stroke="#2d5016" strokeWidth="1.5" />
        {/* Rose bloom - layered petals */}
        <circle cx={size / 2} cy={size * 0.35} r={treeSize * 0.9} fill={color} opacity="0.8" />
        <circle cx={size / 2 - 5} cy={size * 0.32} r={treeSize * 0.7} fill={color} />
        <circle cx={size / 2 + 5} cy={size * 0.32} r={treeSize * 0.7} fill={color} />
        <circle cx={size / 2} cy={size * 0.28} r={treeSize * 0.5} fill={color} opacity="0.9" />
        {/* Center */}
        <circle cx={size / 2} cy={size * 0.35} r={treeSize * 0.3} fill="#FFB6C1" />
        {/* Leaves */}
        <ellipse cx={size / 2 - 15} cy={size * 0.55} rx="8" ry="12" fill="#2d5016" transform={`rotate(-30 ${size / 2 - 15} ${size * 0.55})`} />
        <ellipse cx={size / 2 + 15} cy={size * 0.58} rx="8" ry="12" fill="#2d5016" transform={`rotate(30 ${size / 2 + 15} ${size * 0.58})`} />
      </>
    ),

    lavender: (
      <>
        {/* Stem */}
        <line x1={size / 2} y1={size * 0.5} x2={size / 2} y2={size * 0.75} stroke="#6B8E23" strokeWidth="2" />
        {/* Flower clusters - small circles stacked */}
        {[...Array(7)].map((_, i) => (
          <circle
            key={i}
            cx={size / 2 + Math.sin(i * 0.9) * 6}
            cy={size * 0.25 + i * 5}
            r="4"
            fill={color}
            opacity={0.7 + i * 0.04}
          />
        ))}
        {/* Foliage */}
        <ellipse cx={size / 2 - 12} cy={size * 0.6} rx="6" ry="14" fill="#556B2F" opacity="0.7" />
        <ellipse cx={size / 2 + 12} cy={size * 0.62} rx="6" ry="14" fill="#556B2F" opacity="0.7" />
      </>
    ),

    banyan: (
      <>
        {/* Main trunk */}
        <rect x={size / 2 - 8} y={size * 0.4} width="16" height={size * 0.35} fill="#8B4513" rx="2" />
        {/* Aerial roots */}
        <line x1={size / 2 - 8} y1={size * 0.45} x2={size / 2 - 18} y2={size * 0.6} stroke="#8B4513" strokeWidth="2" />
        <line x1={size / 2 + 8} y1={size * 0.48} x2={size / 2 + 18} y2={size * 0.62} stroke="#8B4513" strokeWidth="2" />
        {/* Large canopy - oval shape */}
        <ellipse cx={size / 2} cy={size * 0.32} rx={treeSize * 1.2} ry={treeSize * 0.9} fill={color} opacity="0.85" />
        <circle cx={size / 2 - 15} cy={size * 0.25} r={treeSize * 0.8} fill={color} />
        <circle cx={size / 2 + 15} cy={size * 0.28} r={treeSize * 0.8} fill={color} />
        <circle cx={size / 2} cy={size * 0.15} r={treeSize * 0.7} fill={color} opacity="0.9" />
      </>
    ),

    bamboo: (
      <>
        {/* Segments */}
        {[...Array(5)].map((_, i) => (
          <g key={i}>
            <rect x={size / 2 - 6} y={size * 0.2 + i * 12} width="12" height="10" fill="#3d7d2d" stroke="#2d5016" strokeWidth="1" rx="1" />
            <line x1={size / 2 - 6} y1={size * 0.25 + i * 12} x2={size / 2 + 6} y2={size * 0.25 + i * 12} stroke="#2d5016" strokeWidth="1" />
          </g>
        ))}
        {/* Leaves - clusters from nodes */}
        {[...Array(3)].map((_, i) => (
          <g key={`leaf-${i}`}>
            <ellipse cx={size / 2 - 12} cy={size * 0.28 + i * 15} rx="5" ry="10" fill="#7cb342" transform={`rotate(-35 ${size / 2 - 12} ${size * 0.28 + i * 15})`} />
            <ellipse cx={size / 2 + 12} cy={size * 0.31 + i * 15} rx="5" ry="10" fill="#7cb342" transform={`rotate(35 ${size / 2 + 12} ${size * 0.31 + i * 15})`} />
          </g>
        ))}
      </>
    ),

    cactus: (
      <>
        {/* Main body - rounded rectangle */}
        <rect x={size / 2 - 10} y={size * 0.2} width="20" height={treeSize * 1.3} fill={color} rx="8" />
        {/* Spines */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12
          const x = Math.cos((angle * Math.PI) / 180) * 12
          const y = Math.sin((angle * Math.PI) / 180) * 12
          return (
            <line
              key={i}
              x1={size / 2}
              y1={size * 0.45 + i * 3}
              x2={size / 2 + x}
              y2={size * 0.45 + i * 3 + y}
              stroke="#f4a460"
              strokeWidth="1.5"
            />
          )
        })}
        {/* Flower bloom at top */}
        {level > 5 && (
          <>
            <circle cx={size / 2 - 6} cy={size * 0.15} r="5" fill="#FF6B9D" />
            <circle cx={size / 2 + 6} cy={size * 0.16} r="5" fill="#FF69B4" />
            <circle cx={size / 2} cy={size * 0.12} r="6" fill="#FF1493" />
          </>
        )}
      </>
    ),

    sunflower: (
      <>
        {/* Stem */}
        <line x1={size / 2} y1={size * 0.5} x2={size / 2} y2={size * 0.75} stroke="#228B22" strokeWidth="3" />
        {/* Petals - sunburst pattern */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12
          const rad = (angle * Math.PI) / 180
          const x1 = size / 2 + Math.cos(rad) * (treeSize * 0.4)
          const y1 = size * 0.35 + Math.sin(rad) * (treeSize * 0.4)
          return (
            <ellipse
              key={i}
              cx={x1}
              cy={y1}
              rx="6"
              ry="12"
              fill={color}
              transform={`rotate(${angle} ${x1} ${y1})`}
            />
          )
        })}
        {/* Center disk */}
        <circle cx={size / 2} cy={size * 0.35} r={treeSize * 0.35} fill="#8B4513" />
        {/* Leaves */}
        <ellipse cx={size / 2 - 18} cy={size * 0.55} rx="7" ry="15" fill="#2d5016" transform={`rotate(-25 ${size / 2 - 18} ${size * 0.55})`} />
        <ellipse cx={size / 2 + 18} cy={size * 0.58} rx="7" ry="15" fill="#2d5016" transform={`rotate(25 ${size / 2 + 18} ${size * 0.58})`} />
      </>
    ),

    orchid: (
      <>
        {/* Stem */}
        <path d={`M ${size / 2} ${size * 0.6} Q ${size / 2 + 8} ${size * 0.5} ${size / 2 + 5} ${size * 0.3}`} stroke="#2d5016" strokeWidth="2" fill="none" />
        {/* Flowers - 3 blooms */}
        {[...Array(3)].map((_, i) => {
          const offsetY = i * 15
          return (
            <g key={i}>
              {/* Petals */}
              <ellipse cx={size / 2 + 5} cy={size * 0.3 - offsetY} rx="8" ry="6" fill={color} opacity="0.9" />
              <ellipse cx={size / 2 + 12} cy={size * 0.32 - offsetY} rx="6" ry="8" fill={color} />
              <ellipse cx={size / 2 - 2} cy={size * 0.35 - offsetY} rx="7" ry="7" fill={color} />
              {/* Center */}
              <circle cx={size / 2 + 5} cy={size * 0.33 - offsetY} r="3" fill="#FFB6C1" />
            </g>
          )
        })}
        {/* Leaves */}
        <ellipse cx={size / 2 - 15} cy={size * 0.65} rx="5" ry="18" fill="#3d7d2d" opacity="0.8" />
      </>
    ),

    moneyPlant: (
      <>
        {/* Vines - curved lines */}
        <path d={`M ${size / 2} ${size * 0.3} Q ${size / 2 - 10} ${size * 0.4} ${size / 2 - 15} ${size * 0.5}`} stroke="#3d7d2d" strokeWidth="2" fill="none" />
        <path d={`M ${size / 2} ${size * 0.35} Q ${size / 2 + 12} ${size * 0.45} ${size / 2 + 18} ${size * 0.55}`} stroke="#3d7d2d" strokeWidth="2" fill="none" />
        {/* Heart-shaped leaves */}
        {[...Array(6)].map((_, i) => {
          const x = size / 2 + Math.cos((i * 60 * Math.PI) / 180) * 15
          const y = size * 0.4 + i * 8
          return (
            <path
              key={i}
              d={`M ${x} ${y} Q ${x - 4} ${y - 3} ${x - 5} ${y - 1} Q ${x - 3} ${y + 2} ${x} ${y + 4} Q ${x + 3} ${y + 2} ${x + 5} ${y - 1} Q ${x + 4} ${y - 3} ${x} ${y}`}
              fill={color}
              opacity="0.85"
            />
          )
        })}
      </>
    ),

    jade: (
      <>
        {/* Main stem */}
        <rect x={size / 2 - 5} y={size * 0.35} width="10" height={size * 0.35} fill="#8B7355" rx="2" />
        {/* Branches */}
        <line x1={size / 2 - 5} y1={size * 0.45} x2={size / 2 - 15} y2={size * 0.4} stroke="#8B7355" strokeWidth="2" />
        <line x1={size / 2 + 5} y1={size * 0.5} x2={size / 2 + 15} y2={size * 0.48} stroke="#8B7355" strokeWidth="2" />
        {/* Fleshy leaves - ovals */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const x = size / 2 + Math.cos(angle) * 12
          const y = size * 0.4 + Math.sin(angle) * 10
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="7"
              ry="5"
              fill={color}
              opacity="0.88"
              transform={`rotate(${i * 45} ${x} ${y})`}
            />
          )
        })}
        {/* Top growth */}
        <circle cx={size / 2} cy={size * 0.32} r={treeSize * 0.5} fill={color} opacity="0.9" />
      </>
    ),

    peony: (
      <>
        {/* Stem */}
        <line x1={size / 2} y1={size * 0.45} x2={size / 2} y2={size * 0.75} stroke="#2d5016" strokeWidth="3" />
        {/* Large full bloom - many petals */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const x = size / 2 + Math.cos(angle) * (treeSize * 0.6)
          const y = size * 0.3 + Math.sin(angle) * (treeSize * 0.5)
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="9"
              ry="13"
              fill={color}
              opacity={0.7 + i * 0.04}
              transform={`rotate(${angle * 57.3} ${x} ${y})`}
            />
          )
        })}
        {/* Inner petals */}
        {[...Array(5)].map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180
          const x = size / 2 + Math.cos(angle) * (treeSize * 0.35)
          const y = size * 0.3 + Math.sin(angle) * (treeSize * 0.3)
          return (
            <ellipse
              key={`inner-${i}`}
              cx={x}
              cy={y}
              rx="7"
              ry="10"
              fill={color}
              opacity="0.9"
            />
          )
        })}
        {/* Center */}
        <circle cx={size / 2} cy={size * 0.3} r={treeSize * 0.25} fill="#FFD700" />
        {/* Leaves */}
        <ellipse cx={size / 2 - 16} cy={size * 0.58} rx="6" ry="14" fill="#2d5016" transform={`rotate(-30 ${size / 2 - 16} ${size * 0.58})`} />
        <ellipse cx={size / 2 + 16} cy={size * 0.6} rx="6" ry="14" fill="#2d5016" transform={`rotate(30 ${size / 2 + 16} ${size * 0.6})`} />
      </>
    )
  }

  // Pot rendering
  const pots = {
    pot1: (
      <g>
        {/* Terracotta pot */}
        <path
          d={`M ${size / 2 - 20} ${size * 0.75} L ${size / 2 - 24} ${size * 0.95} L ${size / 2 + 24} ${size * 0.95} L ${size / 2 + 20} ${size * 0.75} Z`}
          fill={potColor}
          stroke="#8B6F47"
          strokeWidth="1"
        />
        {/* Rim */}
        <ellipse cx={size / 2} cy={size * 0.75} rx="20" ry="6" fill={potColor} stroke="#8B6F47" strokeWidth="1" />
        {/* Shadow */}
        <ellipse cx={size / 2} cy={size * 0.95} rx="24" ry="4" fill="#000" opacity="0.15" />
      </g>
    ),

    pot2: (
      <g>
        {/* Ceramic pot - cylindrical */}
        <rect x={size / 2 - 18} y={size * 0.75} width="36" height={potHeight} fill={potColor} stroke="#555" strokeWidth="1" />
        {/* Gloss effect */}
        <ellipse cx={size / 2 - 8} cy={size * 0.78} rx="3" ry="2" fill="#fff" opacity="0.4" />
        {/* Rim */}
        <ellipse cx={size / 2} cy={size * 0.75} rx="18" ry="5" fill={potColor} stroke="#555" strokeWidth="1" />
        {/* Shadow */}
        <ellipse cx={size / 2} cy={size * 0.95} rx="20" ry="3" fill="#000" opacity="0.2" />
      </g>
    ),

    pot3: (
      <g>
        {/* Glass pot - transparent look */}
        <path
          d={`M ${size / 2 - 16} ${size * 0.75} L ${size / 2 - 20} ${size * 0.93} L ${size / 2 + 20} ${size * 0.93} L ${size / 2 + 16} ${size * 0.75} Z`}
          fill={potColor}
          stroke="#ccc"
          strokeWidth="2"
          opacity="0.7"
        />
        {/* Glass shine */}
        <line x1={size / 2 - 14} y1={size * 0.77} x2={size / 2 - 18} y2={size * 0.9} stroke="#fff" strokeWidth="2" opacity="0.6" />
        {/* Rim */}
        <ellipse cx={size / 2} cy={size * 0.75} rx="16" ry="5" fill="none" stroke="#999" strokeWidth="1.5" />
        {/* Shadow */}
        <ellipse cx={size / 2} cy={size * 0.93} rx="20" ry="3" fill="#000" opacity="0.15" />
      </g>
    ),

    pot4: (
      <g>
        {/* Hanging pot */}
        <circle cx={size / 2} cy={size * 0.7} r="14" fill={potColor} stroke="#666" strokeWidth="1" />
        {/* Hanging strings */}
        <line x1={size / 2 - 10} y1={size * 0.7} x2={size / 2 - 12} y2={size * 0.55} stroke="#8B7355" strokeWidth="1.5" />
        <line x1={size / 2 + 10} y1={size * 0.7} x2={size / 2 + 12} y2={size * 0.55} stroke="#8B7355" strokeWidth="1.5" />
        <line x1={size / 2} y1={size * 0.58} x2={size / 2} y2={size * 0.4} stroke="#8B7355" strokeWidth="2" />
        {/* Ring */}
        <circle cx={size / 2} cy={size * 0.55} r="3" fill="#8B7355" />
        {/* Shadow */}
        <ellipse cx={size / 2} cy={size * 0.84} rx="16" ry="3" fill="#000" opacity="0.15" />
      </g>
    )
  }

  // Effects rendering
  const renderEffects = () => {
    switch (effects) {
      case 'glow':
        return (
          <>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={size / 2} cy={size * 0.4} r={treeSize * 1.1} fill="rgba(255,215,0,0.3)" filter="url(#glow)" />
          </>
        )
      case 'sparkle':
        return (
          <>
            {[...Array(5)].map((_, i) => (
              <circle
                key={i}
                cx={size / 2 + Math.cos((i * 72 * Math.PI) / 180) * 20}
                cy={size * 0.3 + Math.sin((i * 72 * Math.PI) / 180) * 15}
                r="2"
                fill="#FFD700"
                opacity="0.8"
              />
            ))}
          </>
        )
      case 'fog':
        return (
          <>
            <defs>
              <filter id="fog">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>
            <ellipse cx={size / 2 - 5} cy={size * 0.45} rx="25" ry="15" fill="#ddd" opacity="0.4" filter="url(#fog)" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: effects === 'glow' ? 'drop-shadow(0 0 8px rgba(255,215,0,0.4))' : 'none' }}>
        {/* Background */}
        <rect width={size} height={size} fill="transparent" />

        {/* Render tree */}
        {trees[treeType] || trees.rose}

        {/* Render pot */}
        {pots[potType] || pots.pot1}

        {/* Render effects */}
        {renderEffects()}

        {/* Level badge */}
        <circle cx={size - 15} cy={15} r="12" fill="#FFD700" stroke="#FF9800" strokeWidth="1" />
        <text x={size - 15} y={20} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
          {level}
        </text>
      </svg>
    </Box>
  )
}

export default TreeIllustrationV2
