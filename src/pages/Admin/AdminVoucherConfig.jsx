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
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { Settings } from '@mui/icons-material'
import { API_ENDPOINT } from '~/apis'
import CoveziBackground from '~/assets/Cover_Covezi.png'

function AdminVoucherConfig() {
  const [config, setConfig] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [validityDays, setValidityDays] = useState(90)
  const [editDialog, setEditDialog] = useState({ open: false, level: null, discount: '', description: '' })
  const [addDialog, setAddDialog] = useState({ open: false, level: '', discount: '', description: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, level: null })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchConfig()
    fetchStats()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-config`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setConfig(data.data.config)
        setValidityDays(data.data.validityDays)
      } else {
        setError('Failed to fetch config')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-config/stats`, {
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

  const handleUpdateValidity = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-config/validity/days`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days: validityDays }),
      })
      if (response.ok) {
        setError('')
        alert('Validity updated successfully')
      } else {
        setError('Failed to update validity')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddMilestone = async () => {
    if (!addDialog.level || !addDialog.discount) {
      setError('Please fill in all fields')
      return
    }
    try {
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-config/${addDialog.level}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          discountPercent: parseInt(addDialog.discount),
          description: addDialog.description,
        }),
      })
      if (response.ok) {
        fetchConfig()
        setAddDialog({ open: false, level: '', discount: '', description: '' })
      } else {
        setError('Failed to add milestone')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditMilestone = async () => {
    if (!editDialog.discount) {
      setError('Please fill in all fields')
      return
    }
    try {
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-config/${editDialog.level}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          discountPercent: parseInt(editDialog.discount),
          description: editDialog.description,
        }),
      })
      if (response.ok) {
        fetchConfig()
        setEditDialog({ open: false, level: null, discount: '', description: '' })
      } else {
        setError('Failed to update milestone')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteMilestone = async () => {
    if (!deleteDialog.level) return
    try {
      const response = await fetch(`${API_ENDPOINT}/admin/voucher-config/${deleteDialog.level}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        fetchConfig()
        setDeleteDialog({ open: false, level: null })
      } else {
        setError('Failed to delete milestone')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const milestonesArray = Object.entries(config || {}).map(([level, data]) => ({
    level: parseInt(level),
    ...data,
  }))

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${CoveziBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      pb: 4
    }}>
      <Box sx={{ p: 3 }}>
        {/* Stats Cards */}
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
                  <Box sx={{ fontSize: '2rem', fontWeight: 900 }}>
                    {milestonesArray.length}
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', opacity: 0.95, fontWeight: 500, mt: 1 }}>
                    Tổng Milesstones
                  </Box>
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
                  <Box sx={{ fontSize: '2rem', fontWeight: 900 }}>
                    {stats.totalVouchers}
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', opacity: 0.95, fontWeight: 500, mt: 1 }}>
                    Tổng Vouchers
                  </Box>
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
                  <Box sx={{ fontSize: '2rem', fontWeight: 900 }}>
                    {stats.usedVouchers}
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', opacity: 0.95, fontWeight: 500, mt: 1 }}>
                    Vouchers Đã Dùng
                  </Box>
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
                  <Box sx={{ fontSize: '2rem', fontWeight: 900 }}>
                    {validityDays}
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', opacity: 0.95, fontWeight: 500, mt: 1 }}>
                    Ngày Hiệu Lực
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {error && <Alert severity='error'>{error}</Alert>}

        {/* Validity Settings */}
        <Paper sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.05) 0%, rgba(255, 107, 122, 0.05) 100%)'
        }}>
          <Box sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#B6349A', mb: 2 }}>
            ⚙️ Cài đặt Hiệu Lực Voucher
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <TextField
              type='number'
              label='Ngày Hiệu Lực'
              value={validityDays}
              onChange={(e) => setValidityDays(parseInt(e.target.value))}
              size='small'
              sx={{
                width: '180px',
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
              inputProps={{ min: 1, max: 365 }}
            />
            <Button
              variant='contained'
              onClick={handleUpdateValidity}
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
              Cập nhật Hiệu Lực
            </Button>
            <Box sx={{ fontSize: '0.9rem', color: '#666', ml: 2 }}>
              (Vouchers sẽ hết hạn sau {validityDays} ngày)
            </Box>
          </Box>
        </Paper>

      {/* Milestones Table */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Box sx={{ fontSize: '16px', fontWeight: '600' }}>
            🎯 Level Milestones
          </Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setAddDialog({ open: true, level: '', discount: '', description: '' })}
          >
            Add Milestone
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Level</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Discount %</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milestonesArray.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: '#999' }}>
                    No milestones configured
                  </TableCell>
                </TableRow>
              ) : (
                milestonesArray.map((milestone) => (
                  <TableRow key={milestone.level} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ fontWeight: '600' }}>Level {milestone.level}</TableCell>
                    <TableCell>
                      <Box sx={{ fontWeight: '600', color: '#1976d2' }}>
                        {milestone.discountPercent}%
                      </Box>
                    </TableCell>
                    <TableCell>{milestone.description || '—'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        size='small'
                        onClick={() =>
                          setEditDialog({
                            open: true,
                            level: milestone.level,
                            discount: milestone.discountPercent,
                            description: milestone.description || '',
                          })
                        }
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => setDeleteDialog({ open: true, level: milestone.level })}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Milestone Dialog */}
      <Dialog open={addDialog.open} onClose={() => setAddDialog({ open: false, level: '', discount: '', description: '' })}>
        <DialogTitle>Add New Milestone</DialogTitle>
        <DialogContent sx={{ minWidth: '400px', pt: 2 }}>
          <TextField
            fullWidth
            type='number'
            label='Level'
            value={addDialog.level}
            onChange={(e) => setAddDialog({ ...addDialog, level: e.target.value })}
            size='small'
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            type='number'
            label='Discount Percent'
            value={addDialog.discount}
            onChange={(e) => setAddDialog({ ...addDialog, discount: e.target.value })}
            size='small'
            sx={{ mb: 2 }}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            fullWidth
            label='Description'
            value={addDialog.description}
            onChange={(e) => setAddDialog({ ...addDialog, description: e.target.value })}
            size='small'
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog({ open: false, level: '', discount: '', description: '' })}>
            Cancel
          </Button>
          <Button onClick={handleAddMilestone} variant='contained'>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Milestone Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, level: null, discount: '', description: '' })}
      >
        <DialogTitle>Edit Milestone Level {editDialog.level}</DialogTitle>
        <DialogContent sx={{ minWidth: '400px', pt: 2 }}>
          <TextField
            fullWidth
            type='number'
            label='Discount Percent'
            value={editDialog.discount}
            onChange={(e) => setEditDialog({ ...editDialog, discount: e.target.value })}
            size='small'
            sx={{ mb: 2 }}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            fullWidth
            label='Description'
            value={editDialog.description}
            onChange={(e) => setEditDialog({ ...editDialog, description: e.target.value })}
            size='small'
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, level: null, discount: '', description: '' })}>
            Cancel
          </Button>
          <Button onClick={handleEditMilestone} variant='contained'>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, level: null })}>
        <DialogTitle>Delete Milestone?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the milestone for Level {deleteDialog.level}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, level: null })}>Cancel</Button>
          <Button onClick={handleDeleteMilestone} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  )
}

export default AdminVoucherConfig
