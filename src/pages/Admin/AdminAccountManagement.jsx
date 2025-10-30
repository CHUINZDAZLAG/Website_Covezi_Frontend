import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  FormLabel
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Close,
  Block,
  BlockOutlined,
  CheckCircle,
  People,
  PersonAdd,
  CheckCircleOutline,
  HighlightOff
} from '@mui/icons-material'
import { adminUserManagementAPI } from '~/apis/index'
import { toast } from 'react-toastify'

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    role: 'client',
    isActive: true
  })

  useEffect(() => {
    fetchAccounts()
    fetchStats()
  }, [searchTerm])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await adminUserManagementAPI.getAllUsers({
        search: searchTerm,
        page: 1,
        limit: 100
      })
      setAccounts(response.data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await adminUserManagementAPI.getUserStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleOpenDialog = (account = null) => {
    if (account) {
      setEditingAccount(account)
      setFormData({
        email: account.email || '',
        username: account.username || '',
        displayName: account.displayName || '',
        role: account.role || 'client',
        isActive: account.isActive || true
      })
    } else {
      setEditingAccount(null)
      setFormData({
        email: '',
        username: '',
        displayName: '',
        role: 'client',
        isActive: true
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingAccount(null)
    setFormData({
      email: '',
      username: '',
      displayName: '',
      role: 'client',
      isActive: true
    })
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa tài khoản này?')) return

    try {
      await adminUserManagementAPI.deleteUser(accountId)
      await fetchAccounts()
      await fetchStats()
      toast.success('✅ Tài khoản đã được xóa')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error(error.response?.data?.message || 'Không thể xóa tài khoản')
    }
  }

  const handleToggleActive = async (account) => {
    try {
      await adminUserManagementAPI.updateUserStatus(account._id, !account.isActive)
      await fetchAccounts()
      await fetchStats()
      toast.success(`✅ Tài khoản đã được ${!account.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`)
    } catch (error) {
      console.error('Error updating account status:', error)
      toast.error('Không thể cập nhật trạng thái tài khoản')
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f0 100%)',
      pb: 4
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#B6349A', mb: 0.5 }}>
              👥 Quản lý Tài khoản
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
              Quản lý toàn bộ tài khoản người dùng
            </Typography>
          </Box>
        </Box>

        {/* Statistics Cards */}
        {statsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#B6349A' }} />
          </Box>
        ) : stats ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(255, 107, 122, 0.2)',
                border: 'none',
                textAlign: 'center'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <People sx={{ fontSize: 40, opacity: 0.9 }} />
                  </Box>
                  <Typography sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Tổng tài khoản
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                    {stats.summary?.totalUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)',
                border: 'none',
                textAlign: 'center'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <PersonAdd sx={{ fontSize: 40, opacity: 0.9 }} />
                  </Box>
                  <Typography sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Đăng ký
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                    {stats.summary?.totalUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #32778E 0%, #4d99b3 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(50, 119, 142, 0.2)',
                border: 'none',
                textAlign: 'center'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 40, opacity: 0.9 }} />
                  </Box>
                  <Typography sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Đang hoạt động
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                    {stats.summary?.activeUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF4444 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(255, 107, 107, 0.2)',
                border: 'none',
                textAlign: 'center'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <BlockOutlined sx={{ fontSize: 40, opacity: 0.9 }} />
                  </Box>
                  <Typography sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Bị khóa
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                    {stats.summary?.lockedUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}

        {/* Filters Section */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <CardContent>
            <Grid container spacing={2} sx={{ alignItems: 'flex-end' }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="🔍 Tìm kiếm tài khoản..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      backgroundColor: '#f9f9f9',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& fieldset': { borderColor: '#B6349A', borderWidth: 2 }
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #B6349A 0%, #9B2B7A 100%)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9B2B7A 0%, #7A217C 100%)'
                    }
                  }}
                >
                  ➕ Thêm tài khoản mới
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: 1.5,
                    borderColor: '#ddd',
                    color: '#333',
                    fontWeight: 600,
                    '&:hover': { borderColor: '#999', backgroundColor: '#f9f9f9' }
                  }}
                >
                  ↺ Làm mới
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : accounts.length === 0 ? (
          <Alert severity="info">Không có tài khoản nào</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tên hiển thị</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account._id} hover>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.displayName}</TableCell>
                    <TableCell>
                      <Chip
                        label={account.role === 'admin' ? 'Admin' : 'Khách'}
                        color={account.role === 'admin' ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={account.isActive ? 'Hoạt động' : 'Vô hiệu'}
                        color={account.isActive ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(account)}
                        title={account.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {account.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAccount(account._id)}
                        title="Xóa"
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  )
}

export default AdminAccountManagement
