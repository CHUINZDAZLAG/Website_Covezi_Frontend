import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material'

const PET_STYLES = [
  { id: 'danny', name: 'Danny Phantom', color: '#1e88e5' },
  { id: 'doug', name: 'Doug', color: '#8b4513' },
  { id: 'fonze', name: 'Fonze', color: '#ff9800' },
  { id: 'full', name: 'Full', color: '#f44336' },
  { id: 'mrclean', name: 'Mr. Clean', color: '#757575' },
  { id: 'mrt', name: 'Mr. T', color: '#9c27b0' },
  { id: 'pixie', name: 'Pixie', color: '#e91e63' },
  { id: 'turban', name: 'Turban', color: '#00bcd4' }
]

const COLORS = [
  '#000000', '#00bcd4', '#9c27b0', '#8b4513', '#c62828', '#cd5c5c',
  '#ff6f00', '#fdd835', '#fbc02d', '#ffb74d', '#ff8a65', '#ff5722',
  '#ef5350', '#ec407a', '#ff69b4', '#e1bee7'
]

const DECORATIONS = [
  { id: 'bow', name: '🎀 Nơ' },
  { id: 'hat', name: '🎩 Mũ' },
  { id: 'flower', name: '🌸 Hoa' },
  { id: 'star', name: '⭐ Sao' },
  { id: 'bell', name: '🔔 Chuông' },
  { id: 'ribbon', name: '🎗️ Dải' }
]

const PetCustomization = ({ garden, onSave, isLoading }) => {
  const [name, setName] = useState(garden?.petCustomization?.name || 'Gà của tôi')
  const [style, setStyle] = useState(garden?.petCustomization?.style || 'fonze')
  const [color, setColor] = useState(garden?.petCustomization?.color || '#ff9800')
  const [decorations, setDecorations] = useState(garden?.petCustomization?.decorations || [])

  const handleDecorrationToggle = (decoration) => {
    setDecorations(prev =>
      prev.includes(decoration)
        ? prev.filter(d => d !== decoration)
        : [...prev, decoration]
    )
  }

  const handleSave = async () => {
    const customization = { name, style, color, decorations }
    await onSave(customization)
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Preview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Xem Trước Gà" />
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px',
                  margin: '0 auto'
                }}
              >
                🐔
              </Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Style: {PET_STYLES.find(s => s.id === style)?.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Customization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Trang Trí Gà" />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Pet Name */}
              <TextField
                label="Tên gà"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
              />

              {/* Style Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Kiểu gà
                </Typography>
                <Grid container spacing={1}>
                  {PET_STYLES.map(s => (
                    <Grid item xs={6} key={s.id}>
                      <Button
                        fullWidth
                        variant={style === s.id ? 'contained' : 'outlined'}
                        onClick={() => setStyle(s.id)}
                        size="small"
                      >
                        {s.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Color Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Màu sắc
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <Box
                      key={c}
                      onClick={() => setColor(c)}
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: c,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: color === c ? '3px solid #000' : '1px solid #ccc',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Decorations */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Phụ kiện
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {DECORATIONS.map(d => (
                    <Button
                      key={d.id}
                      variant={decorations.includes(d.id) ? 'contained' : 'outlined'}
                      onClick={() => handleDecorrationToggle(d.id)}
                      size="small"
                    >
                      {d.name}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Save Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Đang lưu...' : 'Lưu trang trí'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PetCustomization
