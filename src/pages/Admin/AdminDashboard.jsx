import { useState } from 'react'
import { Box, Paper, Tabs, Tab, Typography, Container } from '@mui/material'
import AdminProductManagement from './AdminProductManagement'
import AdminChallengeManagement from './AdminChallengeManagement'
import AdminVoucherConfig from './AdminVoucherConfig'
import AdminUserVoucherHistory from './AdminUserVoucherHistory'
import AdminAccountManagement from './AdminAccountManagement'
import {
  Inventory2,
  EmojiEvents,
  History,
  People
} from '@mui/icons-material'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ width: '100%' }}>{children}</Box>}
    </div>
  )
}

function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const tabs = [
    { label: '👥 Tài khoản', icon: <People sx={{ fontSize: 20, mr: 1 }} /> },
    { label: '📦 Sản phẩm', icon: <Inventory2 sx={{ fontSize: 20, mr: 1 }} /> },
    { label: '🎯 Thử thách', icon: <EmojiEvents sx={{ fontSize: 20, mr: 1 }} /> },
    { label: '⚙️ Cấu hình Voucher', icon: null },
    { label: '📜 Lịch sử Voucher', icon: <History sx={{ fontSize: 20, mr: 1 }} /> }
  ]

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f0 100%)',
      pb: 4,
      pt: 3
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant='h3'
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #B6349A 0%, #FF6B7A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            📊 Admin Dashboard
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: '#666',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            Quản lý sản phẩm, thử thách, vouchers và dữ liệu người dùng
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 2.5,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(182, 52, 154, 0.08)',
            border: '1px solid rgba(182, 52, 154, 0.1)'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor='primary'
            textColor='primary'
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#666',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                py: 2,
                px: 2.5,
                '&:hover': {
                  color: '#B6349A',
                  backgroundColor: 'rgba(182, 52, 154, 0.05)'
                }
              },
              '& .MuiTab-root.Mui-selected': {
                color: '#B6349A',
                fontWeight: 700
              },
              '& .MuiTabs-indicator': {
                height: 3,
                background: 'linear-gradient(90deg, #B6349A 0%, #FF6B7A 100%)',
                borderRadius: '2px 2px 0 0'
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ width: '100%' }}>
          <TabPanel value={tabValue} index={0}>
            <AdminAccountManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <AdminProductManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <AdminChallengeManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <AdminVoucherConfig />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <AdminUserVoucherHistory />
          </TabPanel>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminDashboard
