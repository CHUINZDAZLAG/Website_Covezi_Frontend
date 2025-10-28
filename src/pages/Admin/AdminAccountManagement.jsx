import React, { useState, useEffect } from 'react'
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
  InputAdornment,
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
  Search,
  Close,
  Block,
  CheckCircle
} from '@mui/icons-material'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

const AdminAccountManagement = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
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
  }, [searchTerm])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const queryString = searchTerm ? `?search=${searchTerm}` : ''
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users${queryString}`)
      setAccounts(Array.isArray(response.data.data) ? response.data.data : [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
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

  const handleSaveAccount = async () => {
    if (!formData.email || !formData.username) {
      toast.error('Vui lòng nhập email và username')
      return
    }

    try {
      if (editingAccount) {
        await authorizedAxiosInstance.put(
          `${API_ROOT}/v1/users/${editingAccount._id}`,
          formData
        )
        toast.success('Tài khoản được cập nhật thành công!')
      } else {
        await authorizedAxiosInstance.post(`${API_ROOT}/v1/users`, formData)
        toast.success('Tài khoản được tạo thành công!')
      }

      await fetchAccounts()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving account:', error)
      toast.error(error.response?.data?.message || 'Không thể lưu tài khoản')
    }
  }

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa tài khoản này?')) return

    try {
      await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/${accountId}`)
      await fetchAccounts()
      toast.success('Tài khoản đã được xóa')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Không thể xóa tài khoản')
    }
  }

  const handleToggleActive = async (account) => {
    try {
      await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/users/${account._id}`,
        { isActive: !account.isActive }
      )
      await fetchAccounts()
      toast.success(`Tài khoản đã được ${!account.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`)
    } catch (error) {
      console.error('Error updating account status:', error)
      toast.error('Không thể cập nhật trạng thái tài khoản')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            👥 Quản lý Tài khoản
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Thêm tài khoản
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm tài khoản (email, username, display name)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />

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
                        onClick={() => handleOpenDialog(account)}
                        title="Chỉnh sửa"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
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

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleFormChange}
              name="email"
              type="email"
              disabled={!!editingAccount}
            />
            <TextField
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleFormChange}
              name="username"
              disabled={!!editingAccount}
            />
            <TextField
              label="Tên hiển thị"
              fullWidth
              value={formData.displayName}
              onChange={handleFormChange}
              name="displayName"
            />
            <FormControl fullWidth>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <MenuItem value="client">Khách hàng</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveAccount} variant="contained">
            {editingAccount ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminAccountManagement
