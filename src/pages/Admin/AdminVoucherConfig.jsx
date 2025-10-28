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
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { API_ENDPOINT } from '~/apis'

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
    <Box>
      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>
                  {milestonesArray.length}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Total Milestones
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#388e3c' }}>
                  {stats.totalVouchers}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Total Vouchers
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#7b1fa2' }}>
                  {stats.usedVouchers}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Used Vouchers
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Box sx={{ fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>
                  {validityDays}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#666', mt: 1 }}>
                  Validity Days
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {error && <Alert severity='error'>{error}</Alert>}

      {/* Validity Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ fontSize: '16px', fontWeight: '600', mb: 2 }}>
          ⚙️ Voucher Validity Settings
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            type='number'
            label='Validity Days'
            value={validityDays}
            onChange={(e) => setValidityDays(parseInt(e.target.value))}
            size='small'
            sx={{ width: '150px' }}
            inputProps={{ min: 1, max: 365 }}
          />
          <Button variant='contained' onClick={handleUpdateValidity}>
            Update Validity
          </Button>
          <Box sx={{ fontSize: '12px', color: '#666', ml: 2 }}>
            (Vouchers will expire after {validityDays} days)
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
  )
}

export default AdminVoucherConfig
