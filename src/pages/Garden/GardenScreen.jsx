import { useState, useEffect } from 'react'
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
  Paper
} from '@mui/material'
import TreeCustomizationV2 from './TreeCustomizationV2'
import GardenGrid from './GardenGrid'
import VoucherNotification from './VoucherNotification'
import { gamificationAPI } from '~/apis/index'
import './GardenScreen.css'

const GardenScreen = () => {
  const [tabValue, setTabValue] = useState(0)
  const [garden, setGarden] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [treeRefresh, setTreeRefresh] = useState(0)
  const [showVoucherNotification, setShowVoucherNotification] = useState(false)
  const [latestVoucher, setLatestVoucher] = useState(null)

  const handleTreeSave = () => {
    setTreeRefresh((prev) => prev + 1)
  }

  // Load garden data
  useEffect(() => {
    const loadGarden = async () => {
      try {
        setLoading(true)
        const response = await gamificationAPI.getUserGarden()
        setGarden(response.data)
        setError(null)
      } catch (err) {
        console.error('Error loading garden:', err)
        setError(err.response?.data?.message || err.message || 'Failed to load garden')
      } finally {
        setLoading(false)
      }
    }

    loadGarden()
  }, [treeRefresh])

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
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, maxWidth: 800, margin: '0 auto 24px', paddingX: 2 }}>
        <span style={{ fontSize: '28px' }}>🌿</span>
        <h2 style={{ margin: 0, color: '#2D5016', fontSize: '24px', fontWeight: 'bold' }}>
          Vườn của tôi
        </h2>
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
          <Tab label="🌳 Vườn" />
          <Tab label="🎨 Trang trí" />
          <Tab label="🎁 Phụ Kiện" />
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

      {/* ===== TAB 3: PHỤ KIỆN ===== */}
      {tabValue === 2 && (
        <Box sx={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Daily Login Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFF8E1 0%, #FFF9C4 100%)',
              border: '2px solid #FFD54F',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <span style={{ fontSize: '24px' }}>📅</span>
                <h3 style={{ margin: 0, color: '#F57F17', fontSize: '16px', fontWeight: 'bold' }}>
                  Đăng nhập hằng ngày
                </h3>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleDailyLogin}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)',
                  },
                }}
              >
                🎁 Nhận thưởng hôm nay
              </Button>
              <Box sx={{ mt: 2, fontSize: '13px', color: '#666', textAlign: 'center' }}>
                Đăng nhập mỗi ngày để nhận thêm XP!
              </Box>
            </CardContent>
          </Card>

          {/* Vouchers Card */}
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
                <h3 style={{ margin: 0, color: '#880E4F', fontSize: '16px', fontWeight: 'bold' }}>
                  Voucher ({garden?.vouchersReceived?.length || 0})
                </h3>
              </Box>
              {garden?.vouchersReceived && garden.vouchersReceived.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {garden.vouchersReceived.map((voucher, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px dashed #E91E63',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                        {voucher.type}
                      </Box>
                      <Chip label={voucher.value || 'N/A'} size="small" color="primary" />
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ color: '#999', fontSize: '13px', textAlign: 'center', py: 2 }}>
                  Chưa có voucher nào
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Inventory Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
              border: '2px solid #0288D1',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <span style={{ fontSize: '24px' }}>📦</span>
                <h3 style={{ margin: 0, color: '#01579B', fontSize: '16px', fontWeight: 'bold' }}>
                  Kho
                </h3>
              </Box>
              {garden?.inventory && garden.inventory.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {garden.inventory.map((item, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px dashed #0288D1',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                        {item.itemName}
                      </Box>
                      <Chip label={`x${item.quantity}`} size="small" color="info" />
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ color: '#999', fontSize: '13px', textAlign: 'center', py: 2 }}>
                  Kho trống
                </Box>
              )}
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
    </Box>
  )
}

export default GardenScreen
