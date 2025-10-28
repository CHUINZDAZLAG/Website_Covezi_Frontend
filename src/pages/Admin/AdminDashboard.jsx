import React, { useState } from 'react'
import { Box, Paper, Tabs, Tab, Typography } from '@mui/material'
import AdminProductManagement from './AdminProductManagement'
import AdminChallengeManagement from './AdminChallengeManagement'
import AdminVoucherConfig from './AdminVoucherConfig'
import AdminUserVoucherHistory from './AdminUserVoucherHistory'
import AdminLevelManagement from './AdminLevelManagement'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5', pt: 2 }}>
      <Box sx={{ px: 3, mb: 3 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333' }}>
          📊 Admin Dashboard
        </Typography>
        <Typography variant='body2' sx={{ color: '#666' }}>
          Manage products, challenges, vouchers, and user data
        </Typography>
      </Box>

      <Paper sx={{ mx: 3, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='📦 Sản phẩm' />
          <Tab label='🎯 Thử thách' />
          <Tab label='📊 Level Management' />
          <Tab label='⚙️ Voucher Config' />
          <Tab label='📜 User Voucher History' />
        </Tabs>
      </Paper>

      <Box sx={{ px: 3, pb: 3 }}>
        {/* <TabPanel value={tabValue} index={0}>
          <AdminAccountManagement />
        </TabPanel> */}
        <TabPanel value={tabValue} index={0}>
          <AdminProductManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AdminChallengeManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <AdminLevelManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <AdminVoucherConfig />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <AdminUserVoucherHistory />
        </TabPanel>
      </Box>
    </Box>
  )
}

export default AdminDashboard
