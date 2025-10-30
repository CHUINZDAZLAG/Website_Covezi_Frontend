import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material'
import {
  Share as ShareIcon,
  FileCopy as CopyIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Twitter as TwitterIcon,
  Telegram as TelegramIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import TreeCustomizationV2 from './TreeCustomizationV2'
import GardenGrid from './GardenGrid'
import VoucherNotification from './VoucherNotification'
import { gamificationAPI, voucherAPI } from '~/apis/index'
import { setGarden as setGardenRedux } from '~/redux/gamification/gamificationSlice'
import './GardenScreen.css'

const GardenScreen = () => {
  const dispatch = useDispatch()
  const gardenState = useSelector(state => state.gamification.garden)
  const [tabValue, setTabValue] = useState(0)
  const [garden, setGarden] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [treeRefresh, setTreeRefresh] = useState(0)
  const [showVoucherNotification, setShowVoucherNotification] = useState(false)
  const [latestVoucher, setLatestVoucher] = useState(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState(null)

  const handleTreeSave = () => {
    setTreeRefresh((prev) => prev + 1)
  }

  const copyVoucherCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Mã voucher đã sao chép!')
  }

  const shareVoucherToSocial = async (platform) => {
    if (!selectedVoucher) return

    try {
      const shareMessage = `🎉 Tôi vừa nhận được voucher ${selectedVoucher.percent}% từ Covezi! 🎁 Hãy tham gia challenges để kiếm voucher của riêng bạn!`
      const baseUrl = window.location.origin

      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareMessage)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
        telegram: `https://t.me/share/url?text=${encodeURIComponent(shareMessage)}`,
        copy_link: null
      }

      if (platform === 'copy_link') {
        navigator.clipboard.writeText(shareMessage)
        toast.success('Thông báo đã sao chép!')
      } else {
        const url = urls[platform]
        if (url) {
          window.open(url, '_blank', 'width=600,height=400')
        }
      }

      // Record sharing in backend
      await voucherAPI.shareVoucher(selectedVoucher._id, {
        platform,
        link: baseUrl
      })

      toast.success(`Chia sẻ đến ${platform} thành công!`)
      setShareDialogOpen(false)
    } catch (error) {
      console.error('Error sharing voucher:', error)
      toast.error('Chia sẻ voucher thất bại')
    }
  }

  // Auto-refresh garden data every 3 seconds, but only if user is focused on the page and logged in
  useEffect(() => {
    let isMounted = true
    let isVisible = true

    // Check if page is visible (browser tab is focused)
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && isMounted) {
        // Page just became visible - refresh immediately
        const loadGarden = async () => {
          try {
            const token = localStorage.getItem('accessToken')
            if (!token) return // Skip if no token
            
            const response = await gamificationAPI.getUserGarden()
            if (isMounted && response?.data) {
              setGarden(response.data)
              dispatch(setGardenRedux(response.data))
            }
          } catch (err) {
            // Silent fail
          }
        }
        loadGarden()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Auto-refresh only when page is visible AND user is logged in
    const refreshGarden = async () => {
      if (!isMounted || !isVisible) return
      
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return // Skip if no token
        
        const response = await gamificationAPI.getUserGarden()
        if (isMounted && response?.data) {
          setGarden(response.data)
          dispatch(setGardenRedux(response.data))
        }
      } catch (err) {
        // Silent fail
      }
    }

    const interval = setInterval(refreshGarden, 3000)

    return () => {
      isMounted = false
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [dispatch])

  // Sync Redux garden state to local state when Redux updates
  useEffect(() => {
    if (gardenState) {
      console.log('[GARDENSCREEN] Redux garden updated:', gardenState)
      console.log('[GARDENSCREEN] Redux currentXp:', gardenState?.currentXp)
      console.log('[GARDENSCREEN] Redux level:', gardenState?.level)
      console.log('[GARDENSCREEN] Redux nextLevelXp:', gardenState?.nextLevelXp)
      setGarden(gardenState)
    }
  }, [gardenState?.currentXp, gardenState?.level, gardenState?.nextLevelXp, gardenState])

  // Load garden data
  useEffect(() => {
    const loadGarden = async () => {
      try {
        setLoading(true)
        const response = await gamificationAPI.getUserGarden()
        setGarden(response.data)
        // Also update Redux store
        dispatch(setGardenRedux(response.data))
        setError(null)
      } catch (err) {
        console.error('Error loading garden:', err)
        setError(err.response?.data?.message || err.message || 'Failed to load garden')
      } finally {
        setLoading(false)
      }
    }

    loadGarden()
  }, [treeRefresh, dispatch])

  // Handle daily login
  const handleDailyLogin = async () => {
    try {
      const response = await gamificationAPI.dailyLogin()
      setGarden(response.data)
      
      // Show voucher notification if voucher earned
      if (response.data?.voucherEarned) {
        setLatestVoucher(response.data.voucherEarned)
        setShowVoucherNotification(true)
      } else {
        alert(`+${response.data?.xpGained || 10} XP from daily login!`)
      }
    } catch (err) {
      console.error('Daily login error:', err)
      alert('Already logged in today or error occurred')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setTreeRefresh((prev) => prev + 1)}>
          Thử lại
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Title - Consistent with Challenge and Product pages */}
      <Box sx={{ backgroundColor: 'transparent', minHeight: 'auto' }}>
        <Box sx={{ maxWidth: 1200, margin: '0 auto 24px', paddingX: 2, mt: 4, mb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ color: '#2D5016', fontWeight: 'bold' }}>
              Vườn của tôi
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ===== TABS SECTION ===== */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, maxWidth: 800, margin: '0 auto 24px' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'none',
              minWidth: 'auto',
              flex: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.05)',
              },
            },
            '& .Mui-selected': {
              color: '#4CAF50 !important',
              fontWeight: 'bold',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4CAF50',
              height: '3px',
              borderRadius: '3px',
            },
          }}
        >
          <Tab label="Vườn" />
          <Tab label="Trang trí" />
          <Tab label="Voucher" />
        </Tabs>
      </Box>

      {/* ===== TAB 1: VƯỜN ===== */}
      {tabValue === 0 && (
        <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
          <GardenGrid
            garden={garden}
            treeCustomization={garden?.treeCustomization}
            onRefresh={() => setTreeRefresh((prev) => prev + 1)}
            isLoading={loading}
            onGardenUpdate={(updatedGarden) => {
              setGarden(updatedGarden)
              // Trigger level-up or voucher notifications
              if (updatedGarden.leveledUp) {
                setLatestVoucher(updatedGarden.voucherEarned)
                if (updatedGarden.voucherEarned) {
                  setShowVoucherNotification(true)
                }
              }
            }}
          />
        </Box>
      )}

      {/* ===== TAB 2: TRANG TRÍ CÂY ===== */}
      {tabValue === 1 && (
        <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
          <TreeCustomizationV2 garden={garden} onSave={handleTreeSave} isLoading={loading} />
        </Box>
      )}

      {/* ===== TAB 3: VOUCHER ===== */}
      {tabValue === 2 && (
        <Box sx={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Vouchers Hiện Tại Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #F3E5F5 0%, #F8BBD0 100%)',
              border: '2px solid #E91E63',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <span style={{ fontSize: '24px' }}>🎟️</span>
                <h3 style={{ margin: 0, color: '#880E4F', fontSize: '18px', fontWeight: 'bold' }}>
                  Voucher của tôi ({garden?.vouchersReceived?.filter(v => v.status === 'active')?.length || 0})
                </h3>
              </Box>
              {garden?.vouchersReceived && garden.vouchersReceived.filter(v => v.status === 'active').length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {garden.vouchersReceived.filter(v => v.status === 'active').map((voucher, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #E91E63',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 1)',
                          boxShadow: '0 2px 8px rgba(233, 30, 99, 0.2)'
                        }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ 
                          fontSize: '12px', 
                          color: '#999', 
                          mb: 0.5,
                          fontWeight: '500'
                        }}>
                          Mã Voucher (Nhấn để sao chép):
                        </Box>
                        <Box sx={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          color: '#222', 
                          fontFamily: 'monospace',
                          p: 1,
                          background: '#F5F5F5',
                          border: '1px dashed #E91E63',
                          borderRadius: '6px',
                          mb: 0.5,
                          wordBreak: 'break-all',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          '&:hover': {
                            background: '#FFFDE7'
                          }
                        }}>
                          {voucher.voucherCode}
                        </Box>
                        <Box sx={{ fontSize: '12px', color: '#666' }}>
                          Giảm {voucher.percent}% • Hết hạn: {new Date(voucher.expiresAt).toLocaleDateString('vi-VN')}
                        </Box>
                      </Box>
                      <Stack direction="row" spacing={0.5} sx={{ ml: 2 }}>
                        <IconButton
                          size="small"
                          onClick={() => copyVoucherCode(voucher.voucherCode)}
                          sx={{ color: '#E91E63' }}
                          title="Sao chép mã"
                        >
                          <CopyIcon sx={{ fontSize: '18px' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedVoucher(voucher)
                            setShareDialogOpen(true)
                          }}
                          sx={{ color: '#E91E63' }}
                          title="Chia sẻ"
                        >
                          <ShareIcon sx={{ fontSize: '18px' }} />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ color: '#999', fontSize: '14px', textAlign: 'center', py: 3, fontStyle: 'italic' }}>
                  Bạn chưa có voucher nào hiện tại
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Voucher Hết Hạn Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
              border: '2px solid #F44336',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <span style={{ fontSize: '24px' }}>⏰</span>
                <h3 style={{ margin: 0, color: '#C62828', fontSize: '18px', fontWeight: 'bold' }}>
                  Voucher hết hạn ({garden?.vouchersReceived?.filter(v => v.status === 'expired')?.length || 0})
                </h3>
              </Box>
              {garden?.vouchersReceived && garden.vouchersReceived.filter(v => v.status === 'expired').length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {garden.vouchersReceived.filter(v => v.status === 'expired').map((voucher, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px dashed #F44336',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: 0.7,
                      }}
                    >
                      <Box>
                        <Box sx={{ fontSize: '13px', fontWeight: 'bold', color: '#666', mb: 0.5 }}>
                          {voucher.code}
                        </Box>
                        <Box sx={{ fontSize: '12px', color: '#999' }}>
                          Hết hạn: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                        </Box>
                      </Box>
                      <Chip 
                        label="Hết hạn" 
                        size="small" 
                        sx={{ background: '#F44336', color: 'white', fontWeight: 'bold' }} 
                      />
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ color: '#999', fontSize: '14px', textAlign: 'center', py: 3, fontStyle: 'italic' }}>
                  Không có voucher hết hạn
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Cách kiếm Voucher Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              border: '2px solid #4CAF50',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <span style={{ fontSize: '24px' }}>⭐</span>
                <h3 style={{ margin: 0, color: '#2E7D32', fontSize: '18px', fontWeight: 'bold' }}>
                  Cách kiếm Voucher
                </h3>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Paper
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #4CAF50',
                    borderRadius: '8px',
                    borderLeft: '4px solid #4CAF50',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <span style={{ fontSize: '20px', minWidth: '24px' }}>🎯</span>
                    <Box>
                      <Box sx={{ fontSize: '13px', fontWeight: 'bold', color: '#2E7D32', mb: 0.5 }}>
                        Tham gia Challenge
                      </Box>
                      <Box sx={{ fontSize: '12px', color: '#666' }}>
                        Tham gia Challenge và hoàn thành nhiệm vụ để kiếm XP. Khi nâng cấp level, bạn sẽ nhận voucher.
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #4CAF50',
                    borderRadius: '8px',
                    borderLeft: '4px solid #4CAF50',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <span style={{ fontSize: '20px', minWidth: '24px' }}>📈</span>
                    <Box>
                      <Box sx={{ fontSize: '13px', fontWeight: 'bold', color: '#2E7D32', mb: 0.5 }}>
                        Nâng cấp Level
                      </Box>
                      <Box sx={{ fontSize: '12px', color: '#666' }}>
                        Mỗi khi bạn nâng cấp level, bạn sẽ nhận một voucher mới với thời hạn 90 ngày.
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #4CAF50',
                    borderRadius: '8px',
                    borderLeft: '4px solid #4CAF50',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <span style={{ fontSize: '20px', minWidth: '24px' }}>🔑</span>
                    <Box>
                      <Box sx={{ fontSize: '13px', fontWeight: 'bold', color: '#2E7D32', mb: 0.5 }}>
                        Code Voucher
                      </Box>
                      <Box sx={{ fontSize: '12px', color: '#666' }}>
                        Mã code: <strong>{garden?.userId}+YYYYMMDD+YYYYMMDD</strong> - Sử dụng để mua sản phẩm
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* Thông tin Voucher Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              border: '2px solid #1976D2',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <span style={{ fontSize: '24px' }}>ℹ️</span>
                <h3 style={{ margin: 0, color: '#0D47A1', fontSize: '18px', fontWeight: 'bold' }}>
                  Hướng dẫn sử dụng Voucher
                </h3>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                  <strong>🔑 Cách sử dụng:</strong> Sao chép mã voucher từ danh sách trên, sau đó dán vào ô "Mã voucher" hoặc ghi chú đơn hàng khi mua trên Shopee. Hệ thống sẽ tự động giảm giá!
                </Box>
                <Box sx={{ 
                  p: 1.5, 
                  background: 'rgba(25, 118, 210, 0.1)', 
                  border: '1px solid #1976D2',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#0D47A1',
                  fontWeight: '500'
                }}>
                  💡 Mỗi voucher có mã riêng không trùng lặp - sao chép mã trong ô xám để đảm bảo sao chép chính xác
                </Box>
                <Box sx={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                  <strong>⏱️ Thời hạn:</strong> Voucher có hiệu lực trong 90 ngày kể từ ngày nhận
                </Box>
                <Box sx={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                  <strong>🔒 Một lần sử dụng:</strong> Mỗi voucher chỉ có thể sử dụng một lần
                </Box>
                <Box sx={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                  <strong>💰 Giá trị:</strong> Voucher được áp dụng tự động khi mua hàng trên Shopee
                </Box>
                <Box sx={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
                  <strong>📱 Chia sẻ:</strong> Chia sẻ voucher của bạn với bạn bè qua Facebook, WhatsApp, Twitter hoặc Telegram
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ===== VOUCHER NOTIFICATION MODAL ===== */}
      <VoucherNotification
        open={showVoucherNotification}
        voucher={latestVoucher}
        onClose={() => setShowVoucherNotification(false)}
      />

      {/* ===== SHARE VOUCHER DIALOG ===== */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Chia sẻ Voucher</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Chia sẻ voucher của bạn với bạn bè trên các nền tảng khác
          </Typography>
          <Stack spacing={2}>
            <Button
              fullWidth
              startIcon={<FacebookIcon />}
              onClick={() => shareVoucherToSocial('facebook')}
              variant="contained"
              sx={{ backgroundColor: '#1877F2' }}
            >
              Chia sẻ lên Facebook
            </Button>
            <Button
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => shareVoucherToSocial('whatsapp')}
              variant="contained"
              sx={{ backgroundColor: '#25D366' }}
            >
              Chia sẻ lên WhatsApp
            </Button>
            <Button
              fullWidth
              startIcon={<TwitterIcon />}
              onClick={() => shareVoucherToSocial('twitter')}
              variant="contained"
              sx={{ backgroundColor: '#1DA1F2' }}
            >
              Chia sẻ lên Twitter
            </Button>
            <Button
              fullWidth
              startIcon={<TelegramIcon />}
              onClick={() => shareVoucherToSocial('telegram')}
              variant="contained"
              sx={{ backgroundColor: '#0088cc' }}
            >
              Chia sẻ lên Telegram
            </Button>
            <Button
              fullWidth
              startIcon={<CopyIcon />}
              onClick={() => shareVoucherToSocial('copy_link')}
              variant="outlined"
            >
              Sao chép thông báo
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GardenScreen
