import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
} from '@mui/material'
import TreeIllustration from './TreeIllustration'
import { TREE_TYPES, POT_TYPES, POT_COLORS, EFFECTS, DECORATIONS, BACKGROUNDS } from './TreeTypes'
import { gamificationAPI } from '~/apis/index'

const TreeCustomization = ({ garden, onSave, isLoading: externalLoading }) => {
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [customName, setCustomName] = useState(garden?.treeCustomization?.name || 'Cây của tôi')
  const [treeType, setTreeType] = useState(garden?.treeCustomization?.treeType || 'rose')
  const [treeColor, setTreeColor] = useState(garden?.treeCustomization?.color || '#FF1493')
  const [potType, setPotType] = useState(garden?.treeCustomization?.potType || 'ceramic')
  const [potColor, setPotColor] = useState(garden?.treeCustomization?.potColor || '#CD5C5C')
  const [effects, setEffects] = useState(garden?.treeCustomization?.effects || 'none')
  const [decorations, setDecorations] = useState(garden?.treeCustomization?.decorations || [])
  const [background, setBackground] = useState(garden?.treeCustomization?.background || 'white')

  const currentTree = TREE_TYPES[treeType]
  const availableColors = currentTree?.colors || []

  const handleAddDecoration = (decorId) => {
    setDecorations(prev =>
      prev.includes(decorId) ? prev.filter(d => d !== decorId) : [...prev, decorId]
    )
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const customization = {
        name: customName,
        treeType,
        color: treeColor,
        potType,
        potColor,
        effects,
        decorations,
        background
      }
      await gamificationAPI.customizeTree(customization)
      onSave()
    } catch (error) {
      console.error('Error saving tree customization:', error)
      alert('Lỗi khi lưu tùy chỉnh cây')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* LEFT SIDE - PREVIEW */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #F5FBF0 0%, #E8F5E9 100%)',
              border: '3px solid #4CAF50',
              borderRadius: '16px',
              position: 'sticky',
              top: 20,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
            }}
          >
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              {/* Tree Name Input */}
              <TextField
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Đặt tên cây..."
                sx={{
                  mb: 2,
                  width: '90%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }
                }}
              />

              {/* Tree Preview */}
              <Box
                sx={{
                  background: BACKGROUNDS.find(b => b.id === background)?.color || '#FFFFFF',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  minHeight: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <TreeIllustration
                  level={garden?.level || 1}
                  treeCustomization={{
                    treeType,
                    potType,
                    color: treeColor,
                    potColor,
                    name: customName,
                    effects,
                    decorations
                  }}
                  size={260}
                />
              </Box>

              {/* Summary */}
              <Box sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: '8px', p: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '13px' }}>
                  <span>Tên:</span>
                  <strong>{customName}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '13px' }}>
                  <span>Loại:</span>
                  <strong>{currentTree?.name}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '13px' }}>
                  <span>Chậu:</span>
                  <strong>{POT_TYPES[potType]?.name}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>Hiệu ứng:</span>
                  <strong>{EFFECTS.find(e => e.id === effects)?.name}</strong>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT SIDE - CUSTOMIZATION */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: '2px solid #E0E0E0', background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF5E1 100%)' }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: '120px',
                  },
                  '& .Mui-selected': {
                    color: '#FF9800 !important',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FF9800',
                    height: '4px',
                  },
                }}
              >
                <Tab label="🌿 Loại Cây" />
                <Tab label="🏺 Chậu & Màu" />
                <Tab label="✨ Hiệu Ứng" />
                <Tab label="🎀 Trang Trí" />
              </Tabs>
            </Box>

            <CardContent sx={{ pt: 3 }}>
              {/* TAB 0: Tree Types */}
              {tabValue === 0 && (
                <Box>
                  <h3 style={{ margin: '0 0 16px 0', color: '#2D5016' }}>🌿 Chọn loại cây</h3>
                  <Grid container spacing={2}>
                    {Object.entries(TREE_TYPES).map(([key, tree]) => (
                      <Grid item xs={6} sm={4} md={3} key={key}>
                        <Button
                          fullWidth
                          onClick={() => {
                            setTreeType(key)
                            setTreeColor(tree.defaultColor)
                          }}
                          sx={{
                            py: 2,
                            borderRadius: '12px',
                            border: treeType === key ? '4px solid #FFD700' : '2px solid #E0E0E0',
                            background: treeType === key
                              ? `linear-gradient(135deg, ${tree.defaultColor} 0%, rgba(0,0,0,0.1) 100%)`
                              : '#FAFAFA',
                            color: '#333',
                            fontWeight: 500,
                            fontSize: '12px',
                            transition: 'all 0.3s ease',
                            boxShadow: treeType === key ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                            },
                          }}
                        >
                          <Box sx={{ fontSize: '32px', mb: 1 }}>{tree.emoji}</Box>
                          {tree.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Color selection for current tree */}
                  <Box sx={{ mt: 3 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>🎨 Chọn màu hoa</h4>
                    <Grid container spacing={2}>
                      {availableColors.map((color) => (
                        <Grid item xs={6} sm={4} md={3} key={color}>
                          <Box
                            onClick={() => setTreeColor(color)}
                            sx={{
                              width: '100%',
                              aspectRatio: '1',
                              backgroundColor: color,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              border: treeColor === color ? '4px solid #FFD700' : '2px solid #DDD',
                              transition: 'all 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '11px',
                              color: 'rgba(0,0,0,0.5)',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                          >
                            {treeColor === color && '✓'}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* TAB 1: Pot & Color */}
              {tabValue === 1 && (
                <Box>
                  {/* Pot Type */}
                  <Box sx={{ mb: 3 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>🏺 Chọn kiểu chậu</h4>
                    <Grid container spacing={2}>
                      {Object.entries(POT_TYPES).map(([key, pot]) => (
                        <Grid item xs={6} sm={4} md={3} key={key}>
                          <Button
                            fullWidth
                            onClick={() => setPotType(key)}
                            sx={{
                              py: 2,
                              borderRadius: '12px',
                              border: potType === key ? '4px solid #FFD700' : '2px solid #E0E0E0',
                              background: potType === key ? '#FFF9E6' : '#FAFAFA',
                              fontWeight: 500,
                              fontSize: '12px',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                              },
                            }}
                          >
                            <Box sx={{ fontSize: '24px', mb: 1 }}>🏺</Box>
                            {pot.name}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Pot Color - Multiple palettes */}
                  <Box>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>🎨 Bảng màu chậu</h4>
                    {Object.entries(POT_COLORS).map(([palette, colors]) => (
                      <Box key={palette} sx={{ mb: 2 }}>
                        <Box sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#666', textTransform: 'capitalize' }}>
                          {palette}
                        </Box>
                        <Grid container spacing={1}>
                          {colors.map((color) => (
                            <Grid item xs={6} sm={4} md={2.4} key={color.value}>
                              <Box
                                onClick={() => setPotColor(color.value)}
                                sx={{
                                  width: '100%',
                                  aspectRatio: '1',
                                  backgroundColor: color.value,
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  border: potColor === color.value ? '4px solid #333' : '2px solid #DDD',
                                  transition: 'all 0.3s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                  },
                                  title: color.name,
                                }}
                              >
                                {potColor === color.value && '✓'}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* TAB 2: Effects */}
              {tabValue === 2 && (
                <Box>
                  <h3 style={{ margin: '0 0 16px 0', color: '#2D5016' }}>✨ Chọn hiệu ứng</h3>
                  <Grid container spacing={2}>
                    {EFFECTS.map((effect) => (
                      <Grid item xs={6} sm={4} md={3} key={effect.id}>
                        <Button
                          fullWidth
                          onClick={() => setEffects(effect.id)}
                          sx={{
                            py: 3,
                            borderRadius: '12px',
                            border: effects === effect.id ? '4px solid #FFD700' : '2px solid #E0E0E0',
                            background: effects === effect.id ? '#F0F4FF' : '#FAFAFA',
                            fontWeight: 500,
                            fontSize: '13px',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                            },
                          }}
                        >
                          <Box sx={{ fontSize: '32px', mb: 1 }}>{effect.emoji}</Box>
                          {effect.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* TAB 3: Decorations */}
              {tabValue === 3 && (
                <Box>
                  <h3 style={{ margin: '0 0 16px 0', color: '#2D5016' }}>🎀 Chọn phụ kiện trang trí</h3>
                  <Box sx={{ mb: 2 }}>
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px 0' }}>
                      Bạn có thể chọn nhiều phụ kiện để trang trí cho cây
                    </p>
                  </Box>
                  <Grid container spacing={2}>
                    {DECORATIONS.map((decor) => (
                      <Grid item xs={6} sm={4} md={3} key={decor.id}>
                        <Button
                          fullWidth
                          onClick={() => handleAddDecoration(decor.id)}
                          sx={{
                            py: 2,
                            borderRadius: '12px',
                            border: decorations.includes(decor.id) ? '4px solid #FFD700' : '2px solid #E0E0E0',
                            background: decorations.includes(decor.id)
                              ? 'linear-gradient(135deg, #FFFACD 0%, #FFE4B5 100%)'
                              : '#FAFAFA',
                            fontWeight: 500,
                            fontSize: '13px',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                            },
                          }}
                        >
                          <Box sx={{ fontSize: '32px', mb: 1 }}>{decor.emoji}</Box>
                          {decor.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Background */}
                  <Box sx={{ mt: 3 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>🎨 Chọn nền</h4>
                    <Grid container spacing={2}>
                      {BACKGROUNDS.map((bg) => (
                        <Grid item xs={6} sm={4} md={3} key={bg.id}>
                          <Box
                            onClick={() => setBackground(bg.id)}
                            sx={{
                              width: '100%',
                              aspectRatio: '1',
                              backgroundColor: bg.color,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              border: background === bg.id ? '4px solid #FF9800' : '2px solid #DDD',
                              transition: 'all 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '11px',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                            title={bg.name}
                          >
                            {background === bg.id && '✓'}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Save Button */}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSave}
                  disabled={isLoading || externalLoading}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isLoading || externalLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang lưu...
                    </>
                  ) : (
                    '✓ Lưu trang trí'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TreeCustomization
