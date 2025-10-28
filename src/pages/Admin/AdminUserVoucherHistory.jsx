import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import BlockIcon from '@mui/icons-material/Block'
import SearchIcon from '@mui/icons-material/Search'
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
      setError('Please enter a User ID')
      return
    }
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-history/users/${userId}`, {
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
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${searchUserId}/vouchers/${voucher._id}/confirm`
          break
        case 'reject':
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${searchUserId}/vouchers/${voucher._id}/reject`
          body = { reason: actionDialog.reason }
          break
        case 'revoke':
          endpoint = `${API_ENDPOINT}/admin/voucher-history/users/${searchUserId}/vouchers/${voucher._id}/revoke`
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
        await handleSearchUser()
        setActionDialog({ open: false, type: null, voucher: null, reason: '' })
      } else {
        setError('Failed to perform action')
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
    <Box>
      {/* Global Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>
                  {stats.totalVouchers}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Total Vouchers
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#388e3c' }}>
                  {stats.activeVouchers}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Active
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>
                  {stats.usedVouchers}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Used
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#7b1fa2' }}>
                  {stats.rejectedVouchers}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Rejected
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {error && <Alert severity='error'>{error}</Alert>}

      {/* Search User */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder='Enter User ID...'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            size='small'
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: '#999' }} /> }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
          />
          <Button variant='contained' onClick={handleSearchUser} disabled={loading}>
            Search
          </Button>
        </Box>
      </Paper>

      {/* User Voucher Summary */}
      {userHistory && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ fontSize: '14px', color: '#666' }}>Total Vouchers</Box>
              <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {userHistory.totalVouchers}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ fontSize: '14px', color: '#666' }}>Active</Box>
              <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                {userHistory.activeVouchers}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ fontSize: '14px', color: '#666' }}>Pending</Box>
              <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
                {userHistory.pendingVouchers}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ fontSize: '14px', color: '#666' }}>Used</Box>
              <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                {userHistory.usedVouchers}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ fontSize: '14px', color: '#666' }}>Rejected</Box>
              <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>
                {userHistory.rejectedVouchers}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Filters */}
      {userHistory && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl size='small' sx={{ minWidth: '150px' }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label='Filter by Status'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='pending'>Pending</MenuItem>
              <MenuItem value='used'>Used</MenuItem>
              <MenuItem value='rejected'>Rejected</MenuItem>
              <MenuItem value='expired'>Expired</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      )}

      {/* Vouchers Table */}
      {userHistory ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Voucher Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Expires</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: '#999' }}>
                    No vouchers found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVouchers.map((voucher) => (
                  <TableRow key={voucher._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ fontWeight: '600', fontFamily: 'monospace' }}>
                      {voucher.code}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ fontWeight: '600', color: '#1976d2' }}>
                        {voucher.discountPercent}%
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={voucher.status} size='small' color={getStatusColor(voucher.status)} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px' }}>
                      {new Date(voucher.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px' }}>
                      {new Date(voucher.expiresAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {voucher.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Button
                            size='small'
                            startIcon={<CheckIcon />}
                            color='success'
                            onClick={() => handleAction('confirm', voucher)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size='small'
                            startIcon={<CloseIcon />}
                            color='error'
                            onClick={() => handleAction('reject', voucher)}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {voucher.status === 'active' && (
                        <Button
                          size='small'
                          startIcon={<BlockIcon />}
                          color='error'
                          onClick={() => handleAction('revoke', voucher)}
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', color: '#999' }}>
          Search for a user to view their voucher history
        </Paper>
      )}

      {/* Pagination */}
      {userHistory && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredVouchers.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color='primary'
          />
        </Box>
      )}

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, type: null, voucher: null, reason: '' })}
      >
        <DialogTitle>
          {actionDialog.type === 'confirm' && 'Confirm Voucher Usage'}
          {actionDialog.type === 'reject' && 'Reject Voucher'}
          {actionDialog.type === 'revoke' && 'Revoke Voucher'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: '400px', pt: 2 }}>
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Box sx={{ fontSize: '12px', color: '#666' }}>Voucher Code</Box>
            <Box sx={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>
              {actionDialog.voucher?.code}
            </Box>
          </Box>

          {(actionDialog.type === 'reject' || actionDialog.type === 'revoke') && (
            <TextField
              fullWidth
              label='Reason (optional)'
              value={actionDialog.reason}
              onChange={(e) => setActionDialog({ ...actionDialog, reason: e.target.value })}
              multiline
              rows={3}
              placeholder='Enter reason for rejection or revocation...'
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
            {actionDialog.type === 'revoke' && 'Revoke'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminUserVoucherHistory
