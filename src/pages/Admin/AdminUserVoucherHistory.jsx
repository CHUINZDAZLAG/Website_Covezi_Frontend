import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Typography,
  InputAdornment
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import BlockIcon from '@mui/icons-material/Block'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import { API_ENDPOINT } from '~/apis'

function AdminUserVoucherHistory() {
  const [stats, setStats] = useState(null)
  const [userHistory, setUserHistory] = useState(null)
  const [filteredVouchers, setFilteredVouchers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')
  const [searchUserId, setSearchUserId] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const [actionDialog, setActionDialog] = useState({ open: false, type: null, voucher: null, reason: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, voucher: null })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (userHistory) {
      filterVouchers()
    }
  }, [statusFilter, userHistory])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-history/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch stats', err)
    }
  }

  const handleSearchUser = async () => {
    if (!userId.trim()) {
      setError('Please enter email, username, or User ID')
      return
    }
    try {
      setLoading(true)
      let foundUserId = userId
      
      // Try to search by email/username if not a MongoDB ID
      if (userId.length !== 24 || !/^[0-9a-f]{24}$/i.test(userId)) {
        try {
          const searchResponse = await fetch(`${API_ENDPOINT}/admin/voucher-history/search?q=${encodeURIComponent(userId)}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            if (searchData.data && searchData.data.length > 0) {
              foundUserId = searchData.data[0]._id
            }
          }
        } catch (searchErr) {
          // If search fails, try as direct ID
          console.log('Search failed, trying as direct ID')
        }
      }
      
      // Fetch user voucher history
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-history/users/${foundUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUserHistory(data.data)
        setSearchUserId(userId)
        setStatusFilter('')
        setPage(1)
      } else {
        setError('User not found')
        setUserHistory(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterVouchers = () => {
    let vouchers = userHistory?.vouchers || []
    if (statusFilter) {
      vouchers = vouchers.filter((v) => v.status === statusFilter)
    }
    setFilteredVouchers(vouchers)
    setPage(1)
  }

  const handleAction = async (type, voucher) => {
    setActionDialog({ open: true, type, voucher, reason: '' })
  }

  const handleConfirmAction = async () => {
    try {
      const { type, voucher } = actionDialog
      let endpoint = ''
      let method = 'POST'
      let body = {}

      switch (type) {
        case 'confirm':
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}/vouchers/${voucher._id}/confirm`
          break
        case 'reject':
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}/vouchers/${voucher._id}/reject`
          body = { reason: actionDialog.reason }
          break
        case 'cancel':
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}/vouchers/${voucher._id}/cancel`
          body = { reason: actionDialog.reason }
          break
        case 'revoke':
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}/vouchers/${voucher._id}/revoke`
          body = { reason: actionDialog.reason }
          break
        default:
          return
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      })

      if (response.ok) {
        // Refresh user history using the actual userId
        const refreshResponse = await fetch(`${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          setUserHistory(data.data)
        }
        setActionDialog({ open: false, type: null, voucher: null, reason: '' })
      } else {
        setError('Failed to perform action')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteVoucher = async () => {
    try {
      const { voucher } = deleteDialog
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}/vouchers/${voucher._id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Refresh user history
        const refreshResponse = await fetch(`${API_ENDPOINT}/admin/voucher-history/users/${userHistory.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          setUserHistory(data.data)
        }
        setDeleteDialog({ open: false, voucher: null })
      } else {
        setError('Failed to delete voucher')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const paginatedVouchers = filteredVouchers.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      used: 'info',
      rejected: 'error',
      expired: 'default',
    }
    return colors[status] || 'default'
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f0 100%)',
      pb: 4
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B6349A', mb: 0.5 }}>
            📜 Lịch sử Voucher
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
            Quản lý lịch sử voucher của người dùng
          </Typography>
        </Box>

        {/* Global Stats */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(255, 107, 122, 0.2)',
                border: 'none'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {stats.totalVouchers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Tổng Vouchers
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
                border: 'none'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {stats.activeVouchers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Hoạt động
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #FFB366 0%, #FFA84D 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(255, 179, 102, 0.2)',
                border: 'none'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {stats.usedVouchers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Đã dùng
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #B6349A 0%, #FF6B7A 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(182, 52, 154, 0.2)',
                border: 'none'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {stats.rejectedVouchers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Bị từ chối
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {error && <Alert severity='error'>{error}</Alert>}

        {/* Search User */}
        <Paper sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder='Tìm kiếm theo email, username, hoặc User ID...'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              size='small'
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#B6349A' }} />
                </InputAdornment>
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#B6349A'
                  }
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#B6349A'
                  }
                }
              }}
            />
            <Button
              variant='contained'
              onClick={handleSearchUser}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(217, 70, 166, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Paper>

        {/* User Voucher Summary */}
        {userHistory && (
          <Paper sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.05) 0%, rgba(255, 107, 122, 0.05) 100%)',
            border: '1px solid rgba(182, 52, 154, 0.1)',
            boxShadow: '0 2px 8px rgba(182, 52, 154, 0.08)'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ fontSize: '0.9rem', color: '#B6349A', fontWeight: 700 }}>Tổng Vouchers</Box>
                <Box sx={{ fontSize: '2rem', fontWeight: 900, color: '#B6349A', mt: 0.5 }}>
                  {userHistory.totalVouchers}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ fontSize: '0.9rem', color: '#4CAF50', fontWeight: 700 }}>Hoạt động</Box>
                <Box sx={{ fontSize: '2rem', fontWeight: 900, color: '#4CAF50', mt: 0.5 }}>
                  {userHistory.activeVouchers}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ fontSize: '0.9rem', color: '#FFB366', fontWeight: 700 }}>Chờ xử lý</Box>
                <Box sx={{ fontSize: '2rem', fontWeight: 900, color: '#FFB366', mt: 0.5 }}>
                  {userHistory.pendingVouchers}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ fontSize: '0.9rem', color: '#32778E', fontWeight: 700 }}>Đã dùng</Box>
                <Box sx={{ fontSize: '2rem', fontWeight: 900, color: '#32778E', mt: 0.5 }}>
                  {userHistory.usedVouchers}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ fontSize: '0.9rem', color: '#FF6B7A', fontWeight: 700 }}>Bị từ chối</Box>
                <Box sx={{ fontSize: '2rem', fontWeight: 900, color: '#FF6B7A', mt: 0.5 }}>
                  {userHistory.rejectedVouchers}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Filters */}
        {userHistory && (
          <Paper sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <FormControl size='small' sx={{ minWidth: '200px' }}>
              <InputLabel sx={{ color: '#B6349A' }}>Lọc theo trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label='Lọc theo trạng thái'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#B6349A'
                    }
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#B6349A'
                    }
                  }
                }}
              >
                <MenuItem value=''>Tất cả</MenuItem>
                <MenuItem value='active'>Hoạt động</MenuItem>
                <MenuItem value='pending'>Chờ xử lý</MenuItem>
                <MenuItem value='used'>Đã dùng</MenuItem>
                <MenuItem value='rejected'>Bị từ chối</MenuItem>
                <MenuItem value='expired'>Hết hạn</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        )}

      {/* Vouchers Table */}
      {userHistory ? (
        <TableContainer component={Paper} sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead sx={{
              background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.08) 0%, rgba(255, 107, 122, 0.08) 100%)',
              borderBottom: '2px solid #e0e0e0'
            }}>
              <TableRow>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#B6349A',
                  fontSize: '0.95rem',
                  py: 2
                }}>Mã Voucher</TableCell>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#B6349A',
                  fontSize: '0.95rem',
                  py: 2
                }}>Giảm</TableCell>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#B6349A',
                  fontSize: '0.95rem',
                  py: 2
                }}>Trạng thái</TableCell>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#B6349A',
                  fontSize: '0.95rem',
                  py: 2
                }}>Tạo lúc</TableCell>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#B6349A',
                  fontSize: '0.95rem',
                  py: 2
                }}>Hết hạn</TableCell>
                <TableCell sx={{
                  fontWeight: 700,
                  color: '#B6349A',
                  fontSize: '0.95rem',
                  py: 2,
                  textAlign: 'center'
                }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: '#999' }}>
                    Không tìm thấy voucher nào
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVouchers.map((voucher) => (
                  <TableRow key={voucher._id} sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(182, 52, 154, 0.03)',
                      borderLeft: '3px solid #B6349A'
                    },
                    borderLeft: '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    <TableCell sx={{
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: '#222',
                      py: 2
                    }}>
                      {voucher.code}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {voucher.discountPercent}%
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={
                          {
                            active: 'Hoạt động',
                            pending: 'Chờ xử lý',
                            used: 'Đã dùng',
                            rejected: 'Bị từ chối',
                            expired: 'Hết hạn'
                          }[voucher.status] || voucher.status
                        }
                        size='small'
                        sx={{
                          backgroundColor: voucher.status === 'active' ? 'rgba(76, 175, 80, 0.15)'
                            : voucher.status === 'pending' ? 'rgba(255, 179, 102, 0.15)'
                            : voucher.status === 'used' ? 'rgba(50, 119, 142, 0.15)'
                            : voucher.status === 'rejected' ? 'rgba(255, 107, 122, 0.15)'
                            : 'rgba(153, 153, 153, 0.15)',
                          color: voucher.status === 'active' ? '#4CAF50'
                            : voucher.status === 'pending' ? '#FFB366'
                            : voucher.status === 'used' ? '#32778E'
                            : voucher.status === 'rejected' ? '#FF6B7A'
                            : '#999',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', py: 2, color: '#666' }}>
                      {new Date(voucher.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', py: 2, color: '#666' }}>
                      {new Date(voucher.expiresAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 2 }}>
                      {voucher.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Button
                            size='small'
                            startIcon={<CheckIcon />}
                            sx={{
                              color: '#4CAF50',
                              borderColor: '#4CAF50',
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.1)'
                              }
                            }}
                            variant='outlined'
                            onClick={() => handleAction('confirm', voucher)}
                          >
                            Duyệt
                          </Button>
                          <Button
                            size='small'
                            startIcon={<CloseIcon />}
                            sx={{
                              color: '#FF6B7A',
                              borderColor: '#FF6B7A',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 122, 0.1)'
                              }
                            }}
                            variant='outlined'
                            onClick={() => handleAction('reject', voucher)}
                          >
                            Từ chối
                          </Button>
                        </Box>
                      )}
                      {voucher.status === 'active' && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Button
                            size='small'
                            startIcon={<BlockIcon />}
                            sx={{
                              color: '#FF6B7A',
                              borderColor: '#FF6B7A',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 122, 0.1)'
                              }
                            }}
                            variant='outlined'
                            onClick={() => handleAction('cancel', voucher)}
                          >
                            Hủy
                          </Button>
                        </Box>
                      )}
                      {voucher.status !== 'pending' && voucher.status !== 'active' && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Button
                            size='small'
                            startIcon={<DeleteIcon />}
                            sx={{
                              color: '#FF6B7A',
                              borderColor: '#FF6B7A',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 122, 0.1)'
                              }
                            }}
                            variant='outlined'
                            onClick={() => setDeleteDialog({ open: true, voucher })}
                          >
                            Xóa
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.05) 0%, rgba(255, 107, 122, 0.05) 100%)'
        }}>
          <Typography sx={{ color: '#999', fontWeight: 500 }}>
            Tìm kiếm người dùng để xem lịch sử voucher
          </Typography>
        </Paper>
      )}

      {/* Pagination */}
      {userHistory && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredVouchers.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
                  color: 'white'
                }
              }
            }}
          />
        </Box>
      )}
      </Container>

      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, type: null, voucher: null, reason: '' })}
      >
        <DialogTitle>
          {actionDialog.type === 'confirm' && 'Confirm Voucher Usage'}
          {actionDialog.type === 'reject' && 'Reject Voucher'}
          {actionDialog.type === 'cancel' && 'Cancel Voucher'}
          {actionDialog.type === 'revoke' && 'Revoke Voucher'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: '400px', pt: 2 }}>
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Box sx={{ fontSize: '12px', color: '#666' }}>Voucher Code</Box>
            <Box sx={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>
              {actionDialog.voucher?.code}
            </Box>
          </Box>

          {(actionDialog.type === 'reject' || actionDialog.type === 'cancel' || actionDialog.type === 'revoke') && (
            <TextField
              fullWidth
              label='Reason (optional)'
              value={actionDialog.reason}
              onChange={(e) => setActionDialog({ ...actionDialog, reason: e.target.value })}
              multiline
              rows={3}
              placeholder='Enter reason for rejection, cancellation or revocation...'
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setActionDialog({ open: false, type: null, voucher: null, reason: '' })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant='contained'
            color={actionDialog.type === 'confirm' ? 'success' : 'error'}
          >
            {actionDialog.type === 'confirm' && 'Confirm'}
            {actionDialog.type === 'reject' && 'Reject'}
            {actionDialog.type === 'cancel' && 'Cancel Voucher'}
            {actionDialog.type === 'revoke' && 'Revoke'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Voucher Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, voucher: null })}>
        <DialogTitle>Delete Voucher?</DialogTitle>
        <DialogContent sx={{ minWidth: '400px', pt: 2 }}>
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Box sx={{ fontSize: '12px', color: '#666' }}>Voucher Code</Box>
            <Box sx={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>
              {deleteDialog.voucher?.code}
            </Box>
          </Box>
          <Box sx={{ color: '#d32f2f' }}>
            Are you sure you want to permanently delete this voucher? This action cannot be undone.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, voucher: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteVoucher}
            variant='contained'
            color='error'
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminUserVoucherHistory
