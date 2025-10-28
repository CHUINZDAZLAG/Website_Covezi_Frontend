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
  Paper,
} from '@mui/material'
import TreeIllustrationV4 from './TreeIllustrationV4'
import { gamificationAPI } from '~/apis/index'

// Tree types with emoji and names
const TREE_TYPES = [
  { id: 'rose', name: 'Hoa hồng', emoji: '🌹', description: 'Hoa hồng lãng mạn' },
  { id: 'lavender', name: 'Hoa lavender', emoji: '💜', description: 'Hoa tím thơm ngát' },
  { id: 'banyan', name: 'Cây đa', emoji: '🌳', description: 'Cây đa lâu đời' },
  { id: 'bamboo', name: 'Cây tre', emoji: '🎋', description: 'Cây tre thon gọn' },
  { id: 'cactus', name: 'Xương rồng', emoji: '🌵', description: 'Cây chịu khô' },
  { id: 'sunflower', name: 'Hoa hướng dương', emoji: '🌻', description: 'Hoa vàng rực rỡ' },
  { id: 'orchid', name: 'Phong lan', emoji: '🌸', description: 'Hoa sang trọng' },
  { id: 'moneyPlant', name: 'Cây kim tiền', emoji: '💚', description: 'Cây tỷ lệ vàng' },
  { id: 'jade', name: 'Cây ngọc', emoji: '💎', description: 'Cây thịt mọng' },
  { id: 'peony', name: 'Hoa mẫu đơn', emoji: '🌷', description: 'Hoa sang trọng' }
]

// Enhanced pot options
const POT_TYPES = [
  { id: 'pot1', name: 'Chậu đất ấm áp', emoji: '🪴', color: '#D7CCC8' },
  { id: 'pot2', name: 'Chậu gốm trắng', emoji: '⚪', color: '#F5F5F5' },
  { id: 'pot3', name: 'Chậu kính trong suốt', emoji: '🔷', color: '#E0F4FF' },
  { id: 'pot4', name: 'Chậu treo chay', emoji: '🎋', color: '#C8A882' }
]

// Pot colors
const POT_COLORS = [
  { name: 'Đất sét', value: '#D7CCC8' },
  { name: 'Nâu nhạt', value: '#A1887F' },
  { name: 'Nâu sẫm', value: '#8D6E63' },
  { name: 'Đỏ gạch', value: '#D32F2F' },
  { name: 'Đỏ nhạt', value: '#EF5350' },
  { name: 'Xám', value: '#757575' },
  { name: 'Xám sáng', value: '#BDBDBD' },
  { name: 'Vàng', value: '#FFD54F' },
  { name: 'Trắng', value: '#F5F5F5' },
  { name: 'Xanh biển', value: '#00897B' },
  { name: 'Xanh lá', value: '#558B2F' },
  { name: 'Hồng', value: '#EC407A' }
]

// Tree colors for each type
const TREE_COLORS = {
  rose: [
    { name: 'Hồng đôi', value: '#E91E63' },
    { name: 'Đỏ tươi', value: '#D32F2F' },
    { name: 'Hồng nhạt', value: '#F48FB1' },
    { name: 'Đỏ sẫm', value: '#8B0000' }
  ],
  lavender: [
    { name: 'Tím', value: '#9C27B0' },
    { name: 'Tím nhạt', value: '#CE93D8' },
    { name: 'Xanh tím', value: '#673AB7' },
    { name: 'Hồng tím', value: '#BA68C8' }
  ],
  banyan: [
    { name: 'Xanh cây', value: '#4CAF50' },
    { name: 'Xanh đậm', value: '#2E7D32' },
    { name: 'Xanh nhạt', value: '#81C784' },
    { name: 'Xanh rừng', value: '#1B5E20' }
  ],
  bamboo: [
    { name: 'Xanh bamboo', value: '#7CB342' },
    { name: 'Xanh sáng', value: '#9CCC65' },
    { name: 'Xanh đậm', value: '#558B2F' },
    { name: 'Xanh nguyên bản', value: '#827717' }
  ],
  cactus: [
    { name: 'Xanh cơ bản', value: '#66BB6A' },
    { name: 'Xanh nhạt', value: '#81C784' },
    { name: 'Xanh sẫm', value: '#388E3C' },
    { name: 'Xanh chiết', value: '#1B5E20' }
  ],
  sunflower: [
    { name: 'Vàng sáng', value: '#FDD835' },
    { name: 'Vàng đậm', value: '#F57F17' },
    { name: 'Vàng cam', value: '#FBC02D' },
    { name: 'Vàng nhạt', value: '#FFEB3B' }
  ],
  orchid: [
    { name: 'Tím nhạt', value: '#E1BEE7' },
    { name: 'Tím đậm', value: '#8E24AA' },
    { name: 'Hồng phong lan', value: '#F06292' },
    { name: 'Trắng tím', value: '#F3E5F5' }
  ],
  moneyPlant: [
    { name: 'Xanh cơ bản', value: '#4CAF50' },
    { name: 'Xanh sáng', value: '#81C784' },
    { name: 'Xanh đậm', value: '#2E7D32' },
    { name: 'Xanh vàng', value: '#9CCC65' }
  ],
  jade: [
    { name: 'Xanh cơ bản', value: '#4CAF50' },
    { name: 'Xanh sâm', value: '#66BB6A' },
    { name: 'Xanh đậm', value: '#388E3C' },
    { name: 'Xanh đỏ', value: '#C62828' }
  ],
  peony: [
    { name: 'Hồng sáng', value: '#EC407A' },
    { name: 'Hồng đậm', value: '#C2185B' },
    { name: 'Trắng', value: '#F5F5F5' },
    { name: 'Hồng nhạt', value: '#F48FB1' }
  ]
}

// Effects
const EFFECTS = [
  { id: 'none', name: 'Bình thường', emoji: '😊', desc: 'Không có hiệu ứng' },
  { id: 'glow', name: 'Tỏa sáng vàng', emoji: '✨', desc: 'Halo ánh vàng' },
  { id: 'sparkle', name: 'Lấp lánh sao', emoji: '⭐', desc: 'Hạt sao lấp lánh' },
  { id: 'fog', name: 'Sương mù', emoji: '🌫️', desc: 'Hiệu ứng sương giăng' }
]

const TreeCustomizationV2 = ({ garden, onSave, isLoading: externalLoading }) => {
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [customName, setCustomName] = useState(garden?.treeCustomization?.name || 'Cây của tôi')
  const [treeType, setTreeType] = useState(garden?.treeCustomization?.treeType || 'rose')
  const [treeColor, setTreeColor] = useState(garden?.treeCustomization?.color || '#E91E63')
  const [potType, setPotType] = useState(garden?.treeCustomization?.potType || 'pot1')
  const [potColor, setPotColor] = useState(garden?.treeCustomization?.potColor || '#D7CCC8')
  const [effects, setEffects] = useState(garden?.treeCustomization?.effects || 'none')

  const treeColors = TREE_COLORS[treeType] || TREE_COLORS.rose
  const selectedTreeName = TREE_TYPES.find(t => t.id === treeType)?.name || 'Cây'

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const customization = {
        name: customName,
        treeType,
        color: treeColor,
        potType,
        potColor,
        effects
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
      <Grid container spacing={3} sx={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* LEFT SIDE - PREVIEW */}
        <Grid item xs={12} md={5}>
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
                  background: 'linear-gradient(180deg, #E0F2F1 0%, #F1F8E9 100%)',
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
                <TreeIllustrationV4
                  level={garden?.level || 1}
                  treeCustomization={{
                    treeType,
                    name: customName,
                    color: treeColor,
                    potType,
                    potColor,
                    effects
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
                  <span>Loại cây:</span>
                  <strong>{selectedTreeName}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '13px' }}>
                  <span>Chậu:</span>
                  <strong>{POT_TYPES.find(p => p.id === potType)?.name}</strong>
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
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: '2px solid #B6349A', background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.08) 0%, rgba(255, 140, 60, 0.06) 100%)' }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: '100px',
                    color: '#666'
                  },
                  '& .Mui-selected': {
                    color: '#32778E !important'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#B6349A',
                    height: '4px'
                  }
                }}
              >
                <Tab label="🌿 Loại cây" />
                <Tab label="🎨 Màu sắc" />
                <Tab label="🏺 Chậu & Hiệu ứng" />
              </Tabs>
            </Box>

            <CardContent sx={{ pt: 3 }}>
              {/* TAB 1: Tree Type */}
              {tabValue === 0 && (
                <Box>
                  <h3 style={{ margin: '0 0 16px 0', color: '#2D5016' }}>Chọn loại cây yêu thích</h3>
                  <Grid container spacing={2}>
                    {TREE_TYPES.map((tree) => (
                      <Grid item xs={6} sm={4} key={tree.id}>
                        <Button
                          fullWidth
                          onClick={() => {
                            setTreeType(tree.id)
                            setTreeColor(TREE_COLORS[tree.id]?.[0]?.value || '#4CAF50')
                          }}
                          sx={{
                            py: 2,
                            borderRadius: '12px',
                            border: treeType === tree.id ? '4px solid #B6349A' : '2px solid #E0E0E0',
                            background: treeType === tree.id ? 'rgba(182, 52, 154, 0.06)' : '#FAFAFA',
                            fontWeight: 500,
                            fontSize: '12px',
                            transition: 'all 0.3s ease',
                            flexDirection: 'column',
                            gap: 1,
                            '&:hover': {
                              transform: 'translateY(-4px)'
                            }
                          }}
                        >
                          <Box sx={{ fontSize: '28px' }}>{tree.emoji}</Box>
                          <Box sx={{ fontWeight: 'bold' }}>{tree.name}</Box>
                          <Box sx={{ fontSize: '11px', color: '#999' }}>{tree.description}</Box>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Save Button for Tab 1 */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSave}
                      disabled={isLoading || externalLoading}
                      sx={{
                        py: 1.3,
                        background: 'linear-gradient(135deg, #B6349A 0%, #FF8C3C 100%)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF8C3C 0%, #FF001A 100%)'
                        },
                        '&:disabled': {
                          opacity: 0.6
                        }
                      }}
                    >
                      {isLoading || externalLoading ? (
                        <>
                          <CircularProgress size={18} sx={{ mr: 1 }} />
                          Đang lưu...
                        </>
                      ) : (
                        '✓ Lưu trang trí'
                      )}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* TAB 2: Colors */}
              {tabValue === 1 && (
                <Box>
                  <h3 style={{ margin: '0 0 16px 0', color: '#2D5016' }}>🎨 Chọn màu lá cây</h3>
                  <Grid container spacing={2}>
                    {treeColors.map((color) => (
                      <Grid item xs={6} sm={3} key={color.value}>
                        <Button
                          fullWidth
                          onClick={() => setTreeColor(color.value)}
                          sx={{
                            py: 2.5,
                            borderRadius: '12px',
                            border: treeColor === color.value ? '4px solid #B6349A' : '2px solid #E0E0E0',
                            background: treeColor === color.value
                              ? `linear-gradient(135deg, ${color.value} 0%, rgba(0,0,0,0.1) 100%)`
                              : '#FAFAFA',
                            color: '#333',
                            fontWeight: 500,
                            fontSize: '12px',
                            transition: 'all 0.3s ease',
                            flexDirection: 'column',
                            gap: 0.5,
                            '&:hover': {
                              transform: 'translateY(-4px)'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: color.value,
                              borderRadius: '6px',
                              margin: '0 auto',
                              border: '1px solid #ddd'
                            }}
                          />
                          {color.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Save Button for Tab 2 */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSave}
                      disabled={isLoading || externalLoading}
                      sx={{
                        py: 1.3,
                        background: 'linear-gradient(135deg, #B6349A 0%, #FF8C3C 100%)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF8C3C 0%, #FF001A 100%)'
                        },
                        '&:disabled': {
                          opacity: 0.6
                        }
                      }}
                    >
                      {isLoading || externalLoading ? (
                        <>
                          <CircularProgress size={18} sx={{ mr: 1 }} />
                          Đang lưu...
                        </>
                      ) : (
                        '✓ Lưu trang trí'
                      )}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* TAB 3: Pot & Effects */}
              {tabValue === 2 && (
                <Box>
                  {/* Pot Type */}
                  <Box sx={{ mb: 3 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>🏺 Kiểu chậu</h4>
                    <Grid container spacing={2}>
                      {POT_TYPES.map((pot) => (
                        <Grid item xs={6} sm={3} key={pot.id}>
                          <Button
                            fullWidth
                            onClick={() => setPotType(pot.id)}
                            sx={{
                              py: 2,
                              borderRadius: '12px',
                              border: potType === pot.id ? '4px solid #B6349A' : '2px solid #E0E0E0',
                              background: potType === pot.id ? '#FFF9E6' : '#FAFAFA',
                              fontWeight: 500,
                              fontSize: '12px',
                              transition: 'all 0.3s ease',
                              flexDirection: 'column',
                              gap: 1,
                              '&:hover': {
                                transform: 'translateY(-4px)'
                              }
                            }}
                          >
                            <Box sx={{ fontSize: '28px' }}>{pot.emoji}</Box>
                            {pot.name}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Pot Color */}
                  <Box sx={{ mb: 3 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>🎨 Màu chậu</h4>
                    <Grid container spacing={2}>
                      {POT_COLORS.map((color) => (
                        <Grid item xs={6} sm={3} key={color.value}>
                          <Box
                            onClick={() => setPotColor(color.value)}
                            sx={{
                              width: '100%',
                              aspectRatio: '1',
                              backgroundColor: color.value,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              border: potColor === color.value ? '4px solid #B6349A' : '2px solid #DDD',
                              transition: 'all 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '11px',
                              color: 'rgba(0,0,0,0.5)',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                            title={color.name}
                          >
                            {potColor === color.value ? '✓' : ''}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Effects */}
                  <Box>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2D5016' }}>✨ Hiệu ứng trang trí</h4>
                    <Grid container spacing={2}>
                      {EFFECTS.map((effect) => (
                        <Grid item xs={6} sm={3} key={effect.id}>
                          <Button
                            fullWidth
                            onClick={() => setEffects(effect.id)}
                            sx={{
                              py: 2,
                              borderRadius: '12px',
                              border: effects === effect.id ? '4px solid #B6349A' : '2px solid #E0E0E0',
                              background: effects === effect.id ? '#F0F4FF' : '#FAFAFA',
                              fontWeight: 500,
                              fontSize: '12px',
                              transition: 'all 0.3s',
                              flexDirection: 'column',
                              gap: 0.5,
                              '&:hover': {
                                transform: 'translateY(-4px)'
                              }
                            }}
                          >
                            <Box sx={{ fontSize: '32px' }}>{effect.emoji}</Box>
                            <Box sx={{ fontWeight: 'bold' }}>{effect.name}</Box>
                            <Box sx={{ fontSize: '10px', color: '#999' }}>{effect.desc}</Box>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Save Button */}
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSave}
                      disabled={isLoading || externalLoading}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #B6349A 0%, #FF8C3C 100%)',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF8C3C 0%, #FF001A 100%)'
                        },
                        '&:disabled': {
                          opacity: 0.6
                        }
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
                </Box>
              )}

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TreeCustomizationV2
